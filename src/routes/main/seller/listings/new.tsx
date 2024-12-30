import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { IconChevronLeft, IconX } from "justd-icons";
import { useForm, useController } from "react-hook-form";
import { toast } from "sonner";
import {
	Button,
	buttonStyles,
	FileTrigger,
	Heading,
	Label,
	NumberField,
	Select,
	Textarea,
	TextField,
	Loader,
} from "ui";
import type { z } from "zod";
import { $createListing } from "~/server/actions/seller";
import { cn } from "~/utils/classes";
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
			fuelType: undefined,
			images: undefined,
			location: "",
			mileage: undefined,
			model: "",
			transmission: undefined,
			vin: "",
			year: new Date().getFullYear(),
		},
	});

	const { mutate, isPending } = useMutation({
		mutationKey: ["createListing"],
		mutationFn: async (data: z.infer<typeof createListingSchema>) => {
			const formData = new FormData();

			// Add all text/number fields
			for (const [key, value] of Object.entries(data)) {
				if (key !== "images" && value !== undefined) {
					formData.append(key, value.toString());
				}
			}

			// Add images
			if (data.images) {
				for (const file of Array.from(data.images)) {
					formData.append("images", file);
				}
			}

			return $createListing({ data: formData });
		},
		onSuccess() {
			toast.success("Listing created successfully");
		},
	});

	const titleField = useController({ control, name: "title" });
	const descriptionField = useController({ control, name: "description" });
	const priceField = useController({ control, name: "price" });
	const conditionField = useController({ control, name: "condition" });
	const makeField = useController({ control, name: "make" });
	const yearField = useController({ control, name: "year" });
	const fuelTypeField = useController({ control, name: "fuelType" });
	const imagesField = useController({ control, name: "images" });
	const locationField = useController({ control, name: "location" });
	const mileageField = useController({ control, name: "mileage" });
	const modelField = useController({ control, name: "model" });
	const transmissionField = useController({ control, name: "transmission" });
	const vinField = useController({ control, name: "vin" });

	const handleImageSelect = (files: FileList | null) => {
		if (!files) {
			imagesField.field.onChange(null);
			return;
		}

		const existingFiles = imagesField.field.value || [];
		const newFiles = Array.from(files);
		const totalFiles = existingFiles.length + newFiles.length;

		if (totalFiles > 6) {
			toast.error("You can only upload a maximum of 6 images");
			return;
		}

		if (totalFiles < 3) {
			toast.error("Please select at least 3 images");
			return;
		}

		for (const file of newFiles) {
			if (file.size > 5 * 1024 * 1024) {
				toast.error("Each image must be less than 5MB");
				return;
			}
		}

		// Combine existing and new files
		imagesField.field.onChange([...existingFiles, ...newFiles]);
	};

	const removeImage = (index: number) => {
		const newFiles = [...(imagesField.field.value || [])];
		newFiles.splice(index, 1);
		imagesField.field.onChange(newFiles);
	};

	const onSubmit = handleSubmit((data) => {
		mutate(data);
	});

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
							isInvalid={!!titleField.fieldState.error}
							errorMessage={titleField.fieldState.error?.message}
						/>
						<div className="flex  flex-col md:flex-row gap-4">
							<TextField
								label="Make"
								{...makeField.field}
								className="flex-1"
								placeholder="Toyota"
								isInvalid={!!makeField.fieldState.error}
								errorMessage={makeField.fieldState.error?.message}
							/>
							<TextField
								label="Model"
								{...modelField.field}
								className="flex-1"
								placeholder="Camry"
								isInvalid={!!modelField.fieldState.error}
								errorMessage={modelField.fieldState.error?.message}
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
								isInvalid={!!priceField.fieldState.error}
								errorMessage={priceField.fieldState.error?.message}
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
								isInvalid={!!yearField.fieldState.error}
								errorMessage={yearField.fieldState.error?.message}
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
								isInvalid={!!mileageField.fieldState.error}
								errorMessage={mileageField.fieldState.error?.message}
							/>
						</div>
						<Select
							label="Condition"
							placeholder="Select car condition"
							isInvalid={!!conditionField.fieldState.error}
							errorMessage={conditionField.fieldState.error?.message}
							selectedKey={conditionField.field.value}
							onSelectionChange={(value) =>
								conditionField.field.onChange(value)
							}
						>
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
							label="VIN (Optional)"
							{...vinField.field}
							placeholder="Enter Vehicle Identification Number"
							isInvalid={!!vinField.fieldState.error}
							errorMessage={vinField.fieldState.error?.message}
						/>
						<TextField
							label="Location"
							{...locationField.field}
							placeholder="Enter vehicle location"
							isInvalid={!!locationField.fieldState.error}
							errorMessage={locationField.fieldState.error?.message}
						/>
						<Select
							label="Fuel Type"
							placeholder="Select fuel type"
							isInvalid={!!fuelTypeField.fieldState.error}
							errorMessage={fuelTypeField.fieldState.error?.message}
							selectedKey={fuelTypeField.field.value}
							onSelectionChange={(value) => fuelTypeField.field.onChange(value)}
						>
							<Select.Trigger />
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
						<Select
							label="Transmission"
							placeholder="Select transmission type"
							isInvalid={!!transmissionField.fieldState.error}
							errorMessage={transmissionField.fieldState.error?.message}
							selectedKey={transmissionField.field.value}
							onSelectionChange={(value) =>
								transmissionField.field.onChange(value)
							}
						>
							<Select.Trigger />
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
							label="Description (Optional)"
							{...descriptionField.field}
							placeholder="Enter detailed description of the vehicle"
							className="min-h-25 leading-snug"
							description={`${descriptionField.field.value?.length || 0}/500`}
							isInvalid={!!descriptionField.fieldState.error}
							errorMessage={descriptionField.fieldState.error?.message}
						/>
						<div className="flex flex-col gap-y-1.5">
							<Label htmlFor="images">
								Images ({imagesField.field.value?.length || 0}/6)
							</Label>
							<div
								className={cn(
									imagesField.field.value?.length > 0 &&
										"grid grid-cols-2 md:grid-cols-3 gap-4 mb-4",
								)}
							>
								{imagesField.field.value &&
									Array.from(imagesField.field.value).map((file, index) => (
										<div key={file.name} className="relative aspect-video">
											<img
												src={URL.createObjectURL(file)}
												alt={`Preview ${index + 1}`}
												className="w-full h-full object-cover rounded-md"
											/>
											<Button
												onPress={() => removeImage(index)}
												intent="danger"
												size="square-petite"
												shape="circle"
												className="absolute -top-2 -right-2 p-1 size-5 *:data-[slot=icon]:size-3"
											>
												<IconX />
											</Button>
										</div>
									))}
							</div>
							{(!imagesField.field.value ||
								imagesField.field.value.length < 6) && (
								<FileTrigger
									className="w-fit"
									onSelect={handleImageSelect}
									allowsMultiple
									acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
								/>
							)}
						</div>
						<Button
							size="small"
							type="submit"
							className="w-full"
							isPending={isPending}
						>
							{({ isPending }) =>
								isPending ? (
									<>
										<Loader />
										"Creating Listing"
									</>
								) : (
									"Create Listing"
								)
							}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
