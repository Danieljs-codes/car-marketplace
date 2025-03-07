import { createServerFn } from "@tanstack/start";
import {
	becomeASellerSchema,
	createListingSchema,
	MAX_PRICE_KOBO,
} from "~/utils/zod-schema";
import {
	maybeSellerMiddleware,
	validateSellerMiddleware,
	validateUserMiddleware,
} from "./auth";
import { paystack } from "../paystack";
import { PERCENTAGE_CHARGE, setCookieAndRedirect } from "./misc";
import schema from "../db/schema";
import { db } from "../db";
import { and, count, desc, eq, ilike, or, sum } from "drizzle-orm";
import { z } from "zod";
import { processImage } from "../utils/image";
import { uploadToStorage } from "../utils/storage";

export const $validateBankDetails = createServerFn({
	method: "POST",
})
	.middleware([validateUserMiddleware])
	.validator((data: unknown) => becomeASellerSchema.parse(data))
	.handler(async ({ context, data }) => {
		const { accountNumber, bankCode } = data;

		const { data: accountDetails, status } =
			await paystack.verification.resolveAccount({
				account_number: accountNumber,
				bank_code: bankCode,
			});

		if (!accountDetails) {
			return {
				status: "error" as const,
				message: "Invalid account details",
			};
		}

		return {
			status: "success" as const,
			message: "Account details are valid",
			data: accountDetails,
		};
	});

export const $createSellerAccount = createServerFn({
	method: "POST",
})
	.middleware([maybeSellerMiddleware])
	.validator((data: unknown) => becomeASellerSchema.parse(data))
	.handler(async ({ context, data }) => {
		if (context.seller) {
			throw setCookieAndRedirect({
				intent: "error",
				message: "You are already a seller",
				description:
					"You cannot create a seller account if you are already a seller",
				to: "/dashboard",
			});
		}

		// Create a paystack subaccount
		const { data: subAccount } = await paystack.subAccount.create({
			account_number: data.accountNumber,
			settlement_bank: data.bankCode,
			business_name: data.businessName,
			primary_contact_phone: data.businessPhoneNumber,
			percentage_charge: PERCENTAGE_CHARGE,
			description: "This is a seller account",
			primary_contact_email: data.businessEmail,
			primary_contact_name: data.businessName,
		});

		if (!subAccount) {
			return {
				status: "error" as const,
				message: "Failed to create seller account",
			};
		}

		// Create a new seller profile in the database

		await db.insert(schema.sellers).values({
			userId: context.auth.user.id,
			businessEmail: data.businessEmail,
			businessPhoneNumber: data.businessPhoneNumber,
			businessName: data.businessName,
			paystackSubaccountId: subAccount.subaccount_code,
		});

		throw setCookieAndRedirect({
			intent: "success",
			message: "You are now a seller",
			description: "You can now list your cars for sale",
			to: "/dashboard",
		});
	});

export const $getSellerActiveListings = createServerFn({
	method: "GET",
})
	.middleware([validateSellerMiddleware])
	.handler(async ({ context, data }) => {
		const result = await db
			.select({
				activeListingsCount: count(schema.carListings.id),
			})
			.from(schema.carListings)
			.where(
				and(
					eq(schema.carListings.sellerId, context.seller.id),
					eq(schema.carListings.status, "active"),
				),
			)
			.execute();

		return result[0]?.activeListingsCount ?? 0;
	});
export const $getTotalRevenueForSeller = createServerFn({
	method: "GET",
})
	.middleware([validateSellerMiddleware])
	.handler(async ({ context, data }) => {
		const result = await db
			.select({
				totalRevenue: sum(schema.orders.amount),
			})
			.from(schema.orders)
			.where(
				and(
					eq(schema.orders.sellerId, context.seller.id),
					eq(schema.orders.status, "completed"),
				),
			)
			.execute();

		const totalRevenueInNaira = (Number(result[0]?.totalRevenue) || 0) / 100;
		return Math.round(totalRevenueInNaira * 100) / 100;
	});
export const $getSellerCarStats = createServerFn({
	method: "GET",
})
	.middleware([validateSellerMiddleware])
	.handler(async ({ context }) => {
		const totalListed = await db
			.select({
				count: count(schema.carListings.id),
			})
			.from(schema.carListings)
			.where(eq(schema.carListings.sellerId, context.seller.id))
			.execute();

		const totalSold = await db
			.select({
				count: count(schema.orders.id),
			})
			.from(schema.orders)
			.where(
				and(
					eq(schema.orders.sellerId, context.seller.id),
					eq(schema.orders.status, "completed"),
				),
			)
			.execute();

		return {
			totalSold: totalSold[0]?.count ?? 0,
			totalListed: totalListed[0]?.count ?? 0,
		};
	});

export const $getRecentListingsForSeller = createServerFn({
	method: "GET",
})
	.middleware([validateSellerMiddleware])
	.handler(async ({ context, data }) => {
		const recentListings = await db
			.select({
				id: schema.carListings.id,
				make: schema.carListings.make,
				model: schema.carListings.model,
				year: schema.carListings.year,
				price: schema.carListings.price,
				status: schema.carListings.status,
				createdAt: schema.carListings.createdAt,
			})
			.from(schema.carListings)
			.where(eq(schema.carListings.sellerId, context.seller.id))
			.orderBy(desc(schema.carListings.createdAt))
			.limit(5)
			.execute();

		return recentListings.map((listing) => ({
			...listing,
			price: listing.price / 100, // Convert from kobo to naira
		}));
	});

const paginatedListingsForSellerSchema = z.object({
	page: z
		.number()
		.min(1)
		.default(1)
		.catch(() => 1),
	pageSize: z
		.number()
		.min(1)
		.max(50)
		.default(10)
		.catch(() => 10),
	search: z.string().default(""),
});

// Get all seller listings with pagination
export const $getPaginatedListingsForSeller = createServerFn({
	method: "GET",
})
	.middleware([validateSellerMiddleware])
	.validator((data: unknown) => paginatedListingsForSellerSchema.parse(data))
	.handler(async ({ context, data }) => {
		const { page, pageSize } = data;
		const offset = (page - 1) * pageSize;

		const listings = await db
			.select({
				id: schema.carListings.id,
				make: schema.carListings.make,
				model: schema.carListings.model,
				year: schema.carListings.year,
				price: schema.carListings.price,
				status: schema.carListings.status,
				createdAt: schema.carListings.createdAt,
			})
			.from(schema.carListings)
			.where(eq(schema.carListings.sellerId, context.seller.id))
			.orderBy(desc(schema.carListings.createdAt))
			.limit(pageSize)
			.offset(offset)
			.execute();

		const totalCount = await db
			.select({ count: count(schema.carListings.id) })
			.from(schema.carListings)
			.where(eq(schema.carListings.sellerId, context.seller.id))
			.execute();

		return {
			listings: listings.map((listing) => ({
				...listing,
				price: listing.price / 100, // Convert from kobo to naira
			})),
			totalCount: Number(totalCount[0]?.count) || 0,
			page,
			pageSize,
			totalPages: Math.ceil((Number(totalCount[0]?.count) || 0) / pageSize),
		};
	});

export const $createListing = createServerFn({
	method: "POST",
})
	.middleware([validateSellerMiddleware])
	.validator((data: unknown) => {
		if (!(data instanceof FormData)) {
			throw new Error("Invalid form data");
		}

		const make = data.get("make");
		const model = data.get("model");
		const year = data.get("year");
		const condition = data.get("condition");
		const price = data.get("price");
		const mileage = data.get("mileage");
		const transmission = data.get("transmission");
		const fuelType = data.get("fuelType");
		const description = data.get("description");
		const location = data.get("location");
		const vin = data.get("vin");
		const category = data.get("category");
		const images = data.getAll("images");



		if (!images.length) {
			throw new Error("At least one image is required");
		}

		if (!images.every((file) => file instanceof File)) {
			throw new Error("Invalid image files");
		}

		if (!make || !model || !year || !condition || !price || !mileage) {
			throw new Error("All fields are required");
		}

		if (Number(price) > MAX_PRICE_KOBO) {
			throw new Error("Price is too high");
		}

		const validated = createListingSchema.parse({
			make,
			model,
			year: Number(year),
			condition,
			price: Number(price) * 100, // Convert naira to kobo
			mileage: Number(mileage),
			transmission,
			fuelType,
			description,
			location,
			vin,
			images,
			category,
		});

		return {
			...validated,
			images: images,
		};
	})
	.handler(async ({ context, data }) => {
		const processedImages = await Promise.all(
			data.images.map(async (file) => {
				const processed = await processImage(file);

				const uploadResult = await uploadToStorage({
					file,
				});

				return {
					...uploadResult,
					blurhash: processed.blurhash,
					size: file.size,
				};
			}),
		);

		({ data, seller: context.seller });

		// Modified insert statement
		await db.insert(schema.carListings).values({
			make: data.make,
			model: data.model,
			year: data.year,
			condition: data.condition,
			price: data.price,
			mileage: data.mileage.toString(),
			transmission: data.transmission,
			fuelType: data.fuelType,
			description: data.description || null,
			category: data.category,
			location: data.location,
			vin: data.vin || null,
			sellerId: context.seller.id,
			images: processedImages,
			status: "active",
		});

		// throw setCookieAndRedirect({
		// 	intent: "success",
		// 	message: "Listing created successfully",
		// 	description: "Your car listing has been created and is now active",
		// 	to: "/listings",
		// });

		return {
			status: "success" as const,
			message: "New listing created successfully",
		};
	});

export const $getPaginatedOrdersForSeller = createServerFn({
	method: "GET",
})
	.middleware([validateSellerMiddleware])
	.validator((data: unknown) => paginatedListingsForSellerSchema.parse(data))
	.handler(async ({ context, data }) => {
		const { page, pageSize, search } = data;
		const offset = (page - 1) * pageSize;

		const orders = await db
			.select({
				id: schema.orders.id,
				amount: schema.orders.amount,
				status: schema.orders.status,
				createdAt: schema.orders.createdAt,
				listingId: schema.orders.listingId,
				buyerId: schema.orders.buyerId,
				platformFee: schema.orders.platformFee,
				listing: {
					make: schema.carListings.make,
					model: schema.carListings.model,
					year: schema.carListings.year,
				},
				buyer: {
					name: schema.users.name,
					email: schema.users.email,
				},
			})
			.from(schema.orders)
			.innerJoin(
				schema.carListings,
				eq(schema.orders.listingId, schema.carListings.id),
			)
			.innerJoin(schema.users, eq(schema.orders.buyerId, schema.users.id))
			.where(
				and(
					eq(schema.orders.sellerId, context.seller.id),
					search
						? or(
								ilike(schema.carListings.make, `%${search}%`),
								ilike(schema.carListings.model, `%${search}%`),
								ilike(schema.users.name, `%${search}%`),
								ilike(schema.users.email, `%${search}%`),
							)
						: undefined,
				),
			)
			.orderBy(desc(schema.orders.createdAt))
			.limit(pageSize)
			.offset(offset);

		const totalCount = await db
			.select({ count: count(schema.orders.id) })
			.from(schema.orders)
			.where(eq(schema.orders.sellerId, context.seller.id))
			.execute();

		return {
			orders: orders.map((order) => ({
				...order,
				amount: order.amount / 100, // Convert from kobo to naira
				platformFee: order.platformFee / 100, // Convert from kobo to naira
				netAmount: (order.amount - order.platformFee) / 100, // Convert from kobo to naira
			})),
			totalCount: Number(totalCount[0]?.count) || 0,
			page,
			pageSize,
			totalPages: Math.ceil((Number(totalCount[0]?.count) || 1) / pageSize),
		};
	});
