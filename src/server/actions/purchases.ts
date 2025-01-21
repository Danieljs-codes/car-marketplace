import { createServerFn } from "@tanstack/start";
import { validateUserMiddleware } from "./auth";
import { db } from "../db";
import { carListingsTable, ordersTable } from "../db/schema";
import { eq } from "drizzle-orm";

export const $getUserPurchases = createServerFn({ method: "GET" })
	.middleware([validateUserMiddleware])
	.handler(async ({ data, context }) => {
		const {
			auth: { user },
		} = context;

		const purchases = await db
			.select({
				id: ordersTable.id,
				amount: ordersTable.amount,
				status: ordersTable.status,
				createdAt: ordersTable.createdAt,
				metadata: ordersTable.metadata,
				car: {
					id: carListingsTable.id,
					make: carListingsTable.make,
					model: carListingsTable.model,
					year: carListingsTable.year,
					images: carListingsTable.images,
				},
			})
			.from(ordersTable)
			.innerJoin(
				carListingsTable,
				eq(ordersTable.listingId, carListingsTable.id),
			)
			.where(eq(ordersTable.buyerId, user.id))
			.orderBy(ordersTable.createdAt);

		return purchases;
	});
