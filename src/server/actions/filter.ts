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

		const listings = await db
			.select()
			.from(carListingsTable)
			.where(and(...conditions))
			.orderBy(sql`${carListingsTable.createdAt} DESC`)
			.limit(20);

		return listings;
	});
