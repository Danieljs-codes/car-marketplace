import { createServerFn } from "@tanstack/start";
import { becomeASellerSchema } from "~/utils/zod-schema";
import {
	maybeSellerMiddleware,
	validateSellerMiddleware,
	validateUserMiddleware,
} from "./auth";
import { paystack } from "../paystack";
import { PERCENTAGE_CHARGE, setCookieAndRedirect } from "./misc";
import { omit } from "~/utils/misc";
import schema, { listingStatusEnum } from "../db/schema";
import { db } from "../db";
import { and, count, desc, eq, sum } from "drizzle-orm";
import { z } from "zod";

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
				totalRevenue: sum(schema.carListings.price),
			})
			.from(schema.carListings)
			.where(eq(schema.carListings.sellerId, context.seller.id))
			.execute();

		// Convert from kobo to naira and round to 2 decimal places
		const totalRevenueInNaira = (Number(result[0]?.totalRevenue) || 0) / 100;
		return Math.round(totalRevenueInNaira * 100) / 100;
	});
export const $getSellerCarStats = createServerFn({
	method: "GET",
})
	.middleware([validateSellerMiddleware])
	.handler(async ({ context }) => {
		const result = await db
			.select({
				totalSold: count(schema.carListings.id),
				totalListed: count(schema.carListings.id),
			})
			.from(schema.carListings)
			.where(eq(schema.carListings.sellerId, context.seller.id))
			.groupBy(schema.carListings.sellerId)
			.execute();

		const soldCount = await db
			.select({
				count: count(schema.carListings.id),
			})
			.from(schema.carListings)
			.where(
				and(
					eq(schema.carListings.sellerId, context.seller.id),
					eq(schema.carListings.status, "sold"),
				),
			)
			.execute();

		return {
			totalSold: soldCount[0]?.count ?? 0,
			totalListed: result[0]?.totalListed ?? 0,
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
