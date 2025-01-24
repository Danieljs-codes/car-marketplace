import { createServerFn } from "@tanstack/start";
import { validateUserMiddleware } from "./auth";
import { z } from "zod";
import { db } from "../db";
import schema from "../db/schema";
import { eq } from "drizzle-orm";
import { paystack } from "../paystack";
import { redirect } from "@tanstack/react-router";
import { redis } from "../redis";
import { setCookieAndRedirect } from "./misc";

const initializePaymentSchema = z.object({
	id: z.string().min(1),
});

type PaymentDataStored = {
	listingId: string;
	price: number;
	sellerId: string;
	buyerId: string;
	email: string;
	status: "pending" | "success";
};

export const $initializePayment = createServerFn({ method: "GET" })
	.middleware([validateUserMiddleware])
	.validator((data: unknown) => initializePaymentSchema.parse(data))
	.handler(async ({ data, context }) => {
		// Get carListings details with seller info
		const [listing] = await db
			.select({
				id: schema.carListings.id,
				price: schema.carListings.price,
				status: schema.carListings.status,
				sellerId: schema.carListings.sellerId,
				paystackSubaccountId: schema.sellers.paystackSubaccountId,
			})
			.from(schema.carListings)
			.innerJoin(
				schema.sellers,
				eq(schema.carListings.sellerId, schema.sellers.id),
			)
			.where(eq(schema.carListings.id, data.id));

		if (!listing) {
			return { status: "error" as const, message: "Car listing not found" };
		}

		if (listing.status !== "active") {
			return {
				status: "error" as const,
				message: "This car is no longer available for purchase",
			};
		}

		// Generate transaction reference
		const reference = `CAR_${listing.id}_${Date.now()}`;

		// Store transaction details in Redis
		await redis.set(
			reference,
			JSON.stringify({
				listingId: listing.id,
				price: listing.price,
				sellerId: listing.sellerId,
				buyerId: context.auth.user.id,
				email: context.auth.user.email,
				status: "pending", // Initial status
			}),
			{
				ex: 60 * 60 * 24, // 1 day
			},
		);

		const response = await paystack.transaction.initialize({
			amount: String(listing.price),
			email: context.auth.user.email,
			reference,
			currency: "NGN",
			subaccount: listing.paystackSubaccountId,
			transaction_charge: listing.price * 0.02,
			callback_url: "http://localhost:3000/payment/callback",
			metadata: {
				listingId: listing.id,
				sellerId: listing.sellerId,
				buyerId: context.auth.user.id,
			},
		});

		console.log(response);

		if (!response.data) {
			return {
				status: "error" as const,
				message: response.message,
			};
		}

		throw redirect({
			href: response.data.authorization_url,
		});
	});

export const verifyPaymentSchema = z.object({
	reference: z.string(),
	trxref: z.string(),
});

export const $verifyPayment = createServerFn({ method: "GET" })
	.validator((data: unknown) => verifyPaymentSchema.parse(data))
	.handler(async ({ data }) => {
		const reference = data.reference;

		// Get transaction details from Redis
		const transactionData = (await redis.get(
			reference,
		)) as PaymentDataStored | null;

		if (!transactionData) {
			throw setCookieAndRedirect({
				intent: "error",
				message: "Payment reference not found",
				to: "/browse-cars",
			});
		}

		// Verify payment with Paystack
		const response = await paystack.transaction.verify(data.trxref);

		if (!response.data) {
			throw setCookieAndRedirect({
				intent: "error",
				message: "Payment verification failed",
				to: "/browse-cars",
			});
		}

		// Create order record
		await db.insert(schema.orders).values({
			buyerId: transactionData.buyerId,
			listingId: transactionData.listingId,
			sellerId: transactionData.sellerId,
			amount: transactionData.price,
			status: "completed",
			platformFee: transactionData.price * 0.02,
			paystackReference: data.reference,
			paystackTransactionId: response.data.reference,
			paymentMetadata: {
				channel: response.data.channel,
				currency: response.data.currency,
				gatewayResponse: response.data.gateway_response,
			},
		});

		// Update car listing status in database
		await db
			.update(schema.carListings)
			.set({
				status: "sold",
			})
			.where(eq(schema.carListings.id, transactionData.listingId));

		// Delete the Redis entry
		await redis.del(reference);

		throw setCookieAndRedirect({
			intent: "success",
			message: "Payment successful",
			// TODO: Redirect to my purchases
			to: "/browse-cars",
		});
	});
