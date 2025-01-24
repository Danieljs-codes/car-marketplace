import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import {
	IconChevronLeft,
	IconChevronRight,
	IconFilter,
	IconLocation,
} from "justd-icons";
import { useState } from "react";
import {
	Badge,
	Button,
	Checkbox,
	Disclosure,
	DisclosureGroup,
	DisclosurePanel,
	DisclosureTrigger,
	Sheet,
} from "ui";
import { z } from "zod";
import {
	carConditionEnum,
	fuelTypeEnum,
	transmissionTypeEnum,
	validCarCategories,
	formatCurrency,
} from "~/utils/misc";
import { getFilteredListingsQueryOptions } from "~/utils/query-options";
import { useSuspenseQueryDeferred } from "~/utils/use-suspense-query-deferred";
import { Link } from "@tanstack/react-router";
import { Card } from "ui";
import { IconSpeedometer } from "~/components/icons/speedometer";
import { Blurhash } from "react-blurhash";
import { BrowseCarsLoading } from "~/components/loading-states/browse-cars-loading";

function EmptyState() {
	return (
		<div className="text-center py-12">
			<h3 className="text-lg font-semibold mb-2">No listings found</h3>
			<p className="text-muted-fg text-sm md:text-base">
				Try adjusting your filters to find what you're looking for.
			</p>
		</div>
	);
}

export const defaultValues = {
	category: [...validCarCategories],
	condition: [...carConditionEnum],
	make: "",
	transmission: [...transmissionTypeEnum],
	fuelType: [...fuelTypeEnum],
	page: 1,
	limit: 12,
};

export const validSearchParam = z.object({
	category: fallback(z.array(z.enum(validCarCategories)), [
		...defaultValues.category,
	]).default([...defaultValues.category]),
	condition: fallback(
		z.array(z.enum(carConditionEnum)),
		defaultValues.condition,
	).default(defaultValues.condition),
	make: fallback(z.string(), defaultValues.make).default(defaultValues.make),
	transmission: fallback(z.array(z.enum(transmissionTypeEnum)), [
		...defaultValues.transmission,
	]).default([...defaultValues.transmission]),
	fuelType: fallback(z.array(z.enum(fuelTypeEnum)), [
		...defaultValues.fuelType,
	]).default([...defaultValues.fuelType]),
	page: fallback(z.number(), defaultValues.page).default(defaultValues.page),
	limit: fallback(z.number(), defaultValues.limit).default(defaultValues.limit),
});

export const Route = createFileRoute("/_main-layout-id/browse-cars")({
	validateSearch: zodValidator(validSearchParam),
	search: {
		middlewares: [stripSearchParams(defaultValues)],
	},
	loaderDeps: ({
		search: { category, condition, fuelType, make, transmission, page, limit },
	}) => ({
		category,
		condition,
		fuelType,
		make,
		transmission,
		page,
		limit,
	}),
	loader: async ({ deps, context }) => {
		context.queryClient.ensureQueryData(getFilteredListingsQueryOptions(deps));
	},
	component: RouteComponent,
	pendingComponent: BrowseCarsLoading,
});

function FiltersContent({
	search,
	onCategoryChange,
	onConditionChange,
	onTransmissionChange,
	onFuelTypeChange,
}: {
	search: z.infer<typeof validSearchParam>;
	onCategoryChange: (category: (typeof validCarCategories)[number]) => void;
	onConditionChange: (condition: (typeof carConditionEnum)[number]) => void;
	onTransmissionChange: (
		transmission: (typeof transmissionTypeEnum)[number],
	) => void;
	onFuelTypeChange: (fuel: (typeof fuelTypeEnum)[number]) => void;
}) {
	return (
		<DisclosureGroup
			allowsMultipleExpanded
			defaultExpandedKeys={[1, 2, 3, 4]}
			className="md:rounded-xl md:border md:**:data-[slot=disclosure]:last:border-b-0"
		>
			<Disclosure className="md:px-2" id={1}>
				<DisclosureTrigger className="text-sm px-2">Category</DisclosureTrigger>
				<DisclosurePanel className="px-2">
					<div className="flex flex-col gap-0.5">
						{validCarCategories.map((category) => (
							<Checkbox
								className="font-medium"
								key={category}
								isSelected={search.category.includes(category)}
								onChange={() => onCategoryChange(category)}
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
								onChange={() => onConditionChange(condition)}
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
								onChange={() => onTransmissionChange(transmission)}
							>
								{transmission.charAt(0).toUpperCase() + transmission.slice(1)}
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
								onChange={() => onFuelTypeChange(fuel)}
							>
								{fuel.charAt(0).toUpperCase() + fuel.slice(1)}
							</Checkbox>
						))}
					</div>
				</DisclosurePanel>
			</Disclosure>
		</DisclosureGroup>
	);
}

function RouteComponent() {
	const [isOpen, setIsOpen] = useState(false);
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	const { data } = useSuspenseQueryDeferred(
		getFilteredListingsQueryOptions(search),
	);

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
			resetScroll: false,
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
			resetScroll: false,
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
			resetScroll: false,
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
			resetScroll: false,
		});
	};

	const handlePageChange = (page: number) => {
		navigate({
			search: {
				...search,
				page,
			},
			resetScroll: true,
		});
	};

	return (
		<div className="py-10 max-w-screen-xl mx-auto px-4">
			<div className="flex justify-end">
				<Button
					appearance="outline"
					size="square-petite"
					className="mb-4 md:hidden"
					onPress={() => setIsOpen(true)}
				>
					<IconFilter />
				</Button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-[256px_1fr] gap-4">
				<Sheet isOpen={isOpen} onOpenChange={setIsOpen}>
					<Sheet.Content
						isFloat={false}
						classNames={{
							content: "pb-4 md:hidden",
						}}
					>
						<Sheet.Header>
							<Sheet.Title>Filters</Sheet.Title>
						</Sheet.Header>
						<Sheet.Body>
							<FiltersContent
								search={search}
								onCategoryChange={handleCategoryChange}
								onConditionChange={handleConditionChange}
								onTransmissionChange={handleTransmissionChange}
								onFuelTypeChange={handleFuelTypeChange}
							/>
						</Sheet.Body>
					</Sheet.Content>
				</Sheet>
				<div className="sticky top-4 px-2 hidden md:block">
					<FiltersContent
						search={search}
						onCategoryChange={handleCategoryChange}
						onConditionChange={handleConditionChange}
						onTransmissionChange={handleTransmissionChange}
						onFuelTypeChange={handleFuelTypeChange}
					/>
				</div>
				<div className="space-y-4">
					<div className="text-sm text-muted-fg">
						{data.listings.length}{" "}
						{data.listings.length === 1 ? "listing" : "listings"} found
					</div>
					{data.listings.length === 0 ? (
						<EmptyState />
					) : (
						<>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{data.listings.map((listing) => (
									<Link
										key={listing.id}
										to="/listings/$listingId"
										params={{ listingId: listing.id }}
										className="block"
									>
										<Card className="h-full hover:border-primary/50 transition-colors overflow-hidden">
											<Card.Content className="p-0">
												<div className="aspect-[4/3] relative">
													<div className="absolute inset-0 z-0">
														<Blurhash
															hash={listing.images[0].blurhash}
															width="100%"
															height="100%"
															resolutionX={32}
															resolutionY={32}
															punch={1}
														/>
													</div>
													<img
														src={listing.images[0].url}
														alt={`${listing.make} ${listing.model}`}
														className="object-cover w-full h-full rounded-t-lg relative z-10 transition-opacity duration-300"
														onLoad={(e) => {
															e.currentTarget.style.opacity = "1";
														}}
														style={{ opacity: 0 }}
													/>
													<div className="absolute top-2 right-2 z-20">
														<Badge shape="circle" intent="secondary">
															{listing.condition.charAt(0).toUpperCase() +
																listing.condition.slice(1)}
														</Badge>
													</div>
												</div>
												<div className="p-4">
													<h3 className="font-semibold">
														{listing.make} {listing.model}
													</h3>
													<p className="text-xl font-bold mt-2">
														{formatCurrency({
															amount: listing.price,
															isKobo: true,
														})}
													</p>
													<div className="grid grid-cols-2 gap-2 mt-3 text-sm">
														<div className="flex items-center gap-1.5 text-muted-fg">
															<IconSpeedometer className="w-4 h-4" />
															<span>{listing.mileage.toLocaleString()} km</span>
														</div>
														<div className="flex items-center gap-1.5 text-muted-fg">
															<IconLocation className="w-4 h-4" />
															<span className="truncate">
																{listing.location}
															</span>
														</div>
													</div>
													<div className="flex flex-wrap gap-x-2 gap-y-1 mt-3 text-sm text-muted-fg">
														<span>{listing.year}</span>
														<span>•</span>
														<span className="capitalize">
															{listing.transmission.toLowerCase()}
														</span>
														<span>•</span>
														<span className="capitalize">
															{listing.fuelType.toLowerCase()}
														</span>
													</div>
												</div>
											</Card.Content>
										</Card>
									</Link>
								))}
							</div>
							<div className="flex justify-between gap-2 mt-4 md:mt-8">
								<Button
									appearance="outline"
									onPress={() => handlePageChange(data.currentPage - 1)}
									isDisabled={data.currentPage <= 1}
									size="small"
								>
									<IconChevronLeft />
									Previous
								</Button>
								<Button
									appearance="outline"
									onPress={() => handlePageChange(data.currentPage + 1)}
									isDisabled={data.currentPage >= data.totalPages}
									size="small"
								>
									Next
									<IconChevronRight />
								</Button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
