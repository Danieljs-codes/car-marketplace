import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import {
	Checkbox,
	Disclosure,
	DisclosureGroup,
	DisclosurePanel,
	DisclosureTrigger,
} from "ui";
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
	const navigate = Route.useNavigate();

	const handleCategoryChange = (
		category: (typeof validCarCategories)[number],
	) => {
		const newCategories = search.category.includes(category)
			? search.category.filter((c) => c !== category)
			: [...search.category, category];

		navigate({
			search: {
				...search,
				category: newCategories,
			},
		});
	};

	const handleConditionChange = (
		condition: (typeof carConditionEnum)[number],
	) => {
		const newConditions = search.condition.includes(condition)
			? search.condition.filter((c) => c !== condition)
			: [...search.condition, condition];

		navigate({
			search: {
				...search,
				condition: newConditions,
			},
		});
	};

	const handleTransmissionChange = (
		transmission: (typeof transmissionTypeEnum)[number],
	) => {
		const newTransmissions = search.transmission.includes(transmission)
			? search.transmission.filter((t) => t !== transmission)
			: [...search.transmission, transmission];

		navigate({
			search: {
				...search,
				transmission: newTransmissions,
			},
		});
	};

	const handleFuelTypeChange = (fuel: (typeof fuelTypeEnum)[number]) => {
		const newFuelTypes = search.fuelType.includes(fuel)
			? search.fuelType.filter((f) => f !== fuel)
			: [...search.fuelType, fuel];

		navigate({
			search: {
				...search,
				fuelType: newFuelTypes,
			},
		});
	};

	return (
		<div className="py-10 max-w-screen-xl mx-auto px-4">
			<div className="grid grid-cols-[256px_1fr] gap-4">
				<div className="sticky top-4 px-2">
					<DisclosureGroup
						allowsMultipleExpanded
						defaultExpandedKeys={[1, 2, 3, 4]}
						className="rounded-xl border **:data-[slot=disclosure]:last:border-b-0"
					>
						<Disclosure className="px-2" id={1}>
							<DisclosureTrigger className="text-sm px-2">
								Category
							</DisclosureTrigger>
							<DisclosurePanel className="px-2">
								<div className="flex flex-col gap-0.5">
									{validCarCategories.map((category) => (
										<Checkbox
											className="font-medium"
											key={category}
											isSelected={search.category.includes(category)}
											onChange={() => handleCategoryChange(category)}
										>
											{category.charAt(0).toUpperCase() +
												category.slice(1).replace(/-/g, " ")}
										</Checkbox>
									))}
								</div>
							</DisclosurePanel>
						</Disclosure>
						<Disclosure className="px-2" id={2}>
							<DisclosureTrigger className="text-sm px-2">
								Condition
							</DisclosureTrigger>
							<DisclosurePanel className="px-2">
								<div className="flex flex-col gap-0.5">
									{carConditionEnum.map((condition) => (
										<Checkbox
											className="font-medium"
											key={condition}
											isSelected={search.condition.includes(condition)}
											onChange={() => handleConditionChange(condition)}
										>
											{condition.charAt(0).toUpperCase() +
												condition.slice(1).replace(/-/g, " ")}
										</Checkbox>
									))}
								</div>
							</DisclosurePanel>
						</Disclosure>
						<Disclosure className="px-2" id={3}>
							<DisclosureTrigger className="text-sm px-2">
								Transmission
							</DisclosureTrigger>
							<DisclosurePanel className="px-2">
								<div className="flex flex-col gap-0.5">
									{transmissionTypeEnum.map((transmission) => (
										<Checkbox
											className="font-medium"
											key={transmission}
											isSelected={search.transmission.includes(transmission)}
											onChange={() => handleTransmissionChange(transmission)}
										>
											{transmission.charAt(0).toUpperCase() +
												transmission.slice(1)}
										</Checkbox>
									))}
								</div>
							</DisclosurePanel>
						</Disclosure>
						<Disclosure className="px-2" id={4}>
							<DisclosureTrigger className="text-sm px-2">
								Fuel Type
							</DisclosureTrigger>
							<DisclosurePanel className="px-2">
								<div className="flex flex-col gap-0.5">
									{fuelTypeEnum.map((fuel) => (
										<Checkbox
											className="font-medium"
											key={fuel}
											isSelected={search.fuelType.includes(fuel)}
											onChange={() => handleFuelTypeChange(fuel)}
										>
											{fuel.charAt(0).toUpperCase() + fuel.slice(1)}
										</Checkbox>
									))}
								</div>
							</DisclosurePanel>
						</Disclosure>
					</DisclosureGroup>
				</div>
				<div className="h-200 bg-red-200"></div>
			</div>
		</div>
	);
}
