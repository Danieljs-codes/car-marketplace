import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import schema from "../db/schema";
import { and, eq, ilike, sql } from "drizzle-orm";
import { db } from "../db";
import { notFound } from "@tanstack/react-router";
import { redis } from "../redis";
import { parseJSON } from "~/utils/misc";

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
			.where(eq(schema.carListings.id, data.id));

		if (!listing.length) {
			throw notFound();
		}

		const carDetails = listing[0];
		return {
			...carDetails,
			price: carDetails.price / 100, // Convert from kobo to naira
			isFavorite: !!carDetails.isFavorite,
		};
	});

export const $searchCarListings = createServerFn({ method: "GET" })
	.validator(
		z.object({
			query: z.string().min(1),
		}),
	)
	.handler(async ({ data }) => {
		const query = data.query.toLowerCase();
		const listings = await db
			.select({
				id: schema.carListings.id,
				make: schema.carListings.make,
				year: schema.carListings.year,
				model: schema.carListings.model,
				images: schema.carListings.images,
			})
			.from(schema.carListings)
			.where(ilike(schema.carListings.make, `%${query}%`));

		return listings;
	});

const HOMEPAGE_LISTINGS_KEY = "homepage:listings";

interface CarListing {
	id: string;
	make: string;
	year: number;
	model: string;
	images: {
		url: string;
		blurhash: string;
		key: string;
		name: string;
		size: number;
	}[];
	mileage: string;
	location: string;
	price: number;
	transmission: "automatic" | "manual";
}

export const $getHomePageCarListings = createServerFn({
	method: "GET",
}).handler(async () => {
	// Try to get cached listings
	const cachedListings = await redis.get(HOMEPAGE_LISTINGS_KEY);
	if (cachedListings) {
		return parseJSON<CarListing[]>(cachedListings);
	}

	// If no cache, get random listings from DB
	const listings = await db
		.select({
			id: schema.carListings.id,
			make: schema.carListings.make,
			year: schema.carListings.year,
			model: schema.carListings.model,
			images: schema.carListings.images,
			mileage: schema.carListings.mileage,
			location: schema.carListings.location,
			price: schema.carListings.price,
			transmission: schema.carListings.transmission,
		})
		.from(schema.carListings)
		.orderBy(sql`RANDOM()`)
		.limit(8);

	// Calculate seconds until 11:59 PM UTC
	const now = new Date();
	const endOfDay = new Date();
	endOfDay.setUTCHours(23, 59, 0, 0);
	const secondsUntilExpiry = Math.floor(
		(endOfDay.getTime() - now.getTime()) / 1000,
	);

	// Cache the listings
	await redis.set(HOMEPAGE_LISTINGS_KEY, JSON.stringify(listings), {
		ex: secondsUntilExpiry,
	});

	return listings;
});
