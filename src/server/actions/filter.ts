import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import { and, eq, inArray, type SQL, sql } from "drizzle-orm";
import { carListingsTable } from "../db/schema";
import { db } from "../db";
import {
	carConditionEnum,
	fuelTypeEnum,
	transmissionTypeEnum,
	validCarCategories,
} from "~/utils/misc";

export const validSearchParam = z.object({
	category: z.array(z.enum(validCarCategories)),
	condition: z.array(z.enum(carConditionEnum)),
	make: z.string(),
	transmission: z.array(z.enum(transmissionTypeEnum)),
	fuelType: z.array(z.enum(fuelTypeEnum)),
	page: z.number().default(1),
	limit: z.number().default(12),
});

export const $getFiltersContent = createServerFn({ method: "GET" })
	.validator((data: unknown) => validSearchParam.parse(data))
	.handler(async ({ data }) => {
		const conditions: SQL[] = [];

		if (data.category.length < validCarCategories.length) {
			conditions.push(inArray(carListingsTable.category, data.category));
		}

		if (data.condition.length < carConditionEnum.length) {
			conditions.push(inArray(carListingsTable.condition, data.condition));
		}

		if (data.transmission.length < transmissionTypeEnum.length) {
			conditions.push(
				inArray(carListingsTable.transmission, data.transmission),
			);
		}

		if (data.fuelType.length < fuelTypeEnum.length) {
			conditions.push(inArray(carListingsTable.fuelType, data.fuelType));
		}

		if (data.make) {
			conditions.push(eq(carListingsTable.make, data.make));
		}

		// Always filter for active listings
		conditions.push(eq(carListingsTable.status, "active"));

		const offset = (data.page - 1) * data.limit;

		const [listings, totalCount] = await Promise.all([
			db
				.select()
				.from(carListingsTable)
				.where(and(...conditions))
				.orderBy(sql`${carListingsTable.createdAt} DESC`)
				.limit(data.limit)
				.offset(offset),
			db
				.select({ count: sql<number>`count(*)` })
				.from(carListingsTable)
				.where(and(...conditions))
				.then(result => result[0].count)
		]);

		return {
			listings,
			totalPages: Math.ceil(totalCount / data.limit),
			currentPage: data.page
		};
	});
