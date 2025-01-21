import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import schema from "../db/schema";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { notFound } from "@tanstack/react-router";

const carDetailsSchema = z.object({
	id: z.string().min(1),
	userId: z.string().optional(),
});

export const $getCarDetails = createServerFn({ method: "GET" })
	.validator((data: unknown) => carDetailsSchema.parse(data))
	.handler(async ({ data }) => {
		const listing = await db
			.select({
				id: schema.carListings.id,
				make: schema.carListings.make,
				model: schema.carListings.model,
				year: schema.carListings.year,
				condition: schema.carListings.condition,
				price: schema.carListings.price,
				mileage: schema.carListings.mileage,
				transmission: schema.carListings.transmission,
				fuelType: schema.carListings.fuelType,
				description: schema.carListings.description,
				category: schema.carListings.category,
				status: schema.carListings.status,
				images: schema.carListings.images,
				location: schema.carListings.location,
				vin: schema.carListings.vin,
				createdAt: schema.carListings.createdAt,
				seller: {
					id: schema.sellers.id,
					businessName: schema.sellers.businessName,
					businessEmail: schema.sellers.businessEmail,
					businessPhoneNumber: schema.sellers.businessPhoneNumber,
				},
				isFavorite: schema.favorites.id,
			})
			.from(schema.carListings)
			.innerJoin(
				schema.sellers,
				eq(schema.carListings.sellerId, schema.sellers.id),
			)
			.leftJoin(
				schema.favorites,
				and(
					eq(schema.favorites.listingId, schema.carListings.id),
					data.userId ? eq(schema.favorites.userId, data.userId) : undefined,
				),
			)
			.where(eq(schema.carListings.id, data.id))
			.execute();

		if (!listing.length || listing[0].status !== "active") {
			throw notFound();
		}

		const carDetails = listing[0];
		return {
			...carDetails,
			price: carDetails.price / 100, // Convert from kobo to naira
			isFavorite: !!carDetails.isFavorite,
		};
	});
