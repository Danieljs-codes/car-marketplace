import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import {
	carConditionEnum,
	fuelTypeEnum,
	transmissionTypeEnum,
	validCarCategories,
} from "~/utils/misc";

const defaultValues = {
	category: [...validCarCategories],
	condition: [...carConditionEnum],
	make: "",
	priceMin: 0,
	priceMax: null,
	transmission: [...transmissionTypeEnum],
	fuelType: [...fuelTypeEnum],
};

const validSearchParam = z.object({
	category: fallback(z.array(z.enum(validCarCategories)), [
		...defaultValues.category,
	]).default([...defaultValues.category]),
	condition: fallback(
		z.array(z.enum(carConditionEnum)),
		defaultValues.condition,
	).default(defaultValues.condition),
	make: fallback(z.string(), defaultValues.make).default(defaultValues.make),
	priceMin: fallback(z.number(), defaultValues.priceMin).default(
		defaultValues.priceMin,
	),
	priceMax: fallback(z.number().nullable(), defaultValues.priceMax).default(
		defaultValues.priceMax,
	),
	transmission: fallback(z.array(z.enum(transmissionTypeEnum)), [
		...defaultValues.transmission,
	]).default([...defaultValues.transmission]),
	fuelType: fallback(z.array(z.enum(fuelTypeEnum)), [
		...defaultValues.fuelType,
	]).default([...defaultValues.fuelType]),
});

export const Route = createFileRoute("/_main-layout-id/browse-cars")({
	validateSearch: zodValidator(validSearchParam),
	search: {
		middlewares: [stripSearchParams(defaultValues)],
	},
	component: RouteComponent,
});

function RouteComponent() {
	const search = Route.useSearch();

	return (
		<div className="py-10 max-w-screen-xl mx-auto px-4">
			<p>This is the page where users can browse cars</p>
		</div>
	);
}
