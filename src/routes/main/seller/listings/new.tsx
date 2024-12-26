import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { IconChevronLeft } from "justd-icons";
import { useForm, useController } from "react-hook-form";
import {
	buttonStyles,
	Heading,
	NumberField,
	Select,
	Textarea,
	TextField,
} from "ui";
import type { z } from "zod";
import { carConditionEnum, kebabToSentence } from "~/utils/misc";
import { createListingSchema } from "~/utils/zod-schema";

export const Route = createFileRoute("/_seller-layout-id/listings/new")({
	component: RouteComponent,
});

function RouteComponent() {
	const { handleSubmit, control } = useForm<
		z.infer<typeof createListingSchema>
	>({
		resolver: zodResolver(createListingSchema),
		defaultValues: {
			title: "",
			description: "",
			price: undefined,
			condition: "",
			make: "",
			features: [],
			fuelType: undefined,
			images: [],
			location: "",
			mileage: undefined,
			model: "",
			transmission: undefined,
			vin: "",
			year: new Date().getFullYear(),
		},
	});

	const titleField = useController({ control, name: "title" });
	const descriptionField = useController({ control, name: "description" });
	const priceField = useController({ control, name: "price" });
	const conditionField = useController({ control, name: "condition" });
	const makeField = useController({ control, name: "make" });
	const yearField = useController({ control, name: "year" });
	const featuresField = useController({ control, name: "features" });
	const fuelTypeField = useController({ control, name: "fuelType" });
	const imagesField = useController({ control, name: "images" });
	const locationField = useController({ control, name: "location" });
	const mileageField = useController({ control, name: "mileage" });
	const modelField = useController({ control, name: "model" });
	const transmissionField = useController({ control, name: "transmission" });
	const vinField = useController({ control, name: "vin" });

	const onSubmit = handleSubmit((data) => {});

	return (
		<div>
			<div className="flex mb-4">
				<Link
					className={buttonStyles({
						appearance: "outline",
						size: "extra-small",
						className: "flex items-center",
					})}
					to=".."
				>
					<IconChevronLeft />
					Back
				</Link>
			</div>
			<div className="mb-6">
				<Heading className="mb-1">Create New Listing</Heading>
				<p className="text-sm text-muted-fg leading-snug">
					Fill out the form below with accurate details about your tickets to
					create a new listing.
				</p>
			</div>
			<div>
				<form onSubmit={onSubmit}>
					<div className="space-y-5">
						<TextField
							label="Title"
							{...titleField.field}
							placeholder="2023 Toyota Camry XSE"
						/>
						<div className="flex  flex-col md:flex-row gap-4">
							<TextField
								label="Make"
								{...makeField.field}
								className="flex-1"
								placeholder="Toyota"
							/>
							<TextField
								label="Model"
								{...modelField.field}
								className="flex-1"
								placeholder="Camry"
							/>
						</div>
						<div className="flex flex-col md:flex-row gap-4">
							<NumberField
								className="flex-1"
								label="Price"
								{...priceField.field}
								formatOptions={{
									style: "currency",
									currency: "NGN",
									currencyDisplay: "narrowSymbol",
								}}
								placeholder="₦0.00"
							/>
							<NumberField
								className="flex-1"
								label="Year"
								{...yearField.field}
								formatOptions={{
									minimumIntegerDigits: 4,
									useGrouping: false,
								}}
								minValue={1886}
							/>
							<NumberField
								className="flex-1"
								label="Mileage"
								{...mileageField.field}
								formatOptions={{
									style: "unit",
									unit: "kilometer",
									unitDisplay: "narrow",
								}}
								placeholder="0 km"
							/>
						</div>
						<Select label="Condition" placeholder="Select car condition">
							<Select.Trigger />
							<Select.List
								items={carConditionEnum.map((condition) => ({
									id: condition,
									value: condition,
								}))}
							>
								{(item) => (
									<Select.Option id={item.id} textValue={item.value}>
										{kebabToSentence(item.value)}
									</Select.Option>
								)}
							</Select.List>
						</Select>
						<TextField
							label="VIN"
							{...vinField.field}
							placeholder="Enter Vehicle Identification Number"
						/>
						<TextField
							label="Location"
							{...locationField.field}
							placeholder="Enter vehicle location"
						/>
						<Select label="Fuel Type" placeholder="Select fuel type">
							<Select.Trigger {...fuelTypeField.field} />
							<Select.List
								items={[
									{ id: "petrol", value: "petrol" },
									{ id: "diesel", value: "diesel" },
									{ id: "electric", value: "electric" },
									{ id: "hybrid", value: "hybrid" },
								]}
							>
								{(item) => (
									<Select.Option id={item.id} textValue={item.value}>
										{kebabToSentence(item.value)}
									</Select.Option>
								)}
							</Select.List>
						</Select>
						<Select label="Transmission" placeholder="Select transmission type">
							<Select.Trigger {...transmissionField.field} />
							<Select.List
								items={[
									{ id: "automatic", value: "automatic" },
									{ id: "manual", value: "manual" },
								]}
							>
								{(item) => (
									<Select.Option id={item.id} textValue={item.value}>
										{kebabToSentence(item.value)}
									</Select.Option>
								)}
							</Select.List>
						</Select>
						<Textarea
							label="Description"
							{...descriptionField.field}
							placeholder="Enter detailed description of the vehicle"
							className="min-h-25 leading-snug"
							description={`${descriptionField.field.value?.length || 0}/500`}
						/>
						{/* TODO: Add image upload component for imagesField */}
						{/* TODO: Add multi-select component for featuresField */}
						<button
							type="submit"
							className={buttonStyles({
								className: "w-full",
							})}
						>
							Create Listing
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
