import { createServerFn } from "@tanstack/start";
import { validateUserMiddleware } from "./auth";
import { db } from "../db";
import { carListingsTable, favoritesTable } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

export const $addToWishlist = createServerFn({ method: "POST" })
	.middleware([validateUserMiddleware])
	.validator(
		z.object({
			listingId: z.string(),
		}),
	)
	.handler(async ({ data, context }) => {
		const {
			auth: { user },
		} = context;

		// Check if listing exists
		const [listing] = await db
			.select()
			.from(carListingsTable)
			.where(eq(carListingsTable.id, data.listingId))
			.limit(1);

		if (!listing) {
			return {
				status: "error" as const,
				message: "Listing does not exist",
			};
		}

		// Check if already in favorites
		const [existing] = await db
			.select()
			.from(favoritesTable)
			.where(
				and(
					eq(favoritesTable.userId, user.id),
					eq(favoritesTable.listingId, data.listingId),
				),
			)
			.limit(1);

		if (existing) {
			return { status: "success" as const };
		}

		// Add to favorites
		await db.insert(favoritesTable).values({
			userId: user.id,
			listingId: data.listingId,
		});

		return { status: "success" as const };
	});

export const $removeFromWishlist = createServerFn({ method: "POST" })
	.middleware([validateUserMiddleware])
	.validator(
		z.object({
			listingId: z.string(),
		}),
	)
	.handler(async ({ data, context }) => {
		const {
			auth: { user },
		} = context;

		// Delete from favorites
		await db
			.delete(favoritesTable)
			.where(
				and(
					eq(favoritesTable.userId, user.id),
					eq(favoritesTable.listingId, data.listingId),
				),
			);

		return { status: "success" as const };
	});
