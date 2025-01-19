import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams, useRouteContext } from "@tanstack/react-router";
import { IconCart, IconChevronLeft, IconHeart } from "justd-icons";
import {
	Button,
	buttonStyles,
	Card,
	Carousel,
	DescriptionList,
	Separator,
} from "ui";
import { getCarDetailsQueryOptions } from "~/utils/query-options";
import { useState } from "react";
import { Blurhash } from "react-blurhash";
import { formatCurrency } from "~/utils/misc";
import { $initializePayment } from "~/server/actions/payment";
import { toast } from "sonner";
import { Loader } from "ui";

function CarouselImage({
	item,
	make,
	model,
}: {
	item: { url: string; name: string; blurhash?: string };
	make: string;
	model: string;
}) {
	const [isLoading, setIsLoading] = useState(true);

	return (
		<Card className="h-full relative overflow-hidden">
			{isLoading && item.blurhash && (
				<Blurhash
					hash={item.blurhash}
					width="100%"
					height="100%"
					className="absolute inset-0 rounded-md"
				/>
			)}
			<img
				className="w-full h-full rounded-md object-cover object-center"
				src={item.url}
				alt={`${make} ${model} - View ${item.name}`}
				onLoad={() => setIsLoading(false)}
			/>
		</Card>
	);
}

export const Listing = () => {
	const { listingId } = useParams({
		from: "/_main-layout-id/listings/$listingId",
	});
	const { data } = useSuspenseQuery(getCarDetailsQueryOptions(listingId));
	const { auth } = useRouteContext({
		from: "/_main-layout-id/listings/$listingId",
	});

	const { mutate: purchaseCar, isPending } = useMutation({
		mutationKey: ["initializePayment"],
		mutationFn: async () => {
			if (!auth || !auth.user) {
				toast.error("You need to be logged in to purchase this car");
				return;
			}

			const response = await $initializePayment({
				data: {
					id: listingId,
				},
			});

			if (response.status === "error") {
				throw new Error(response.message);
			}
		},

		onError: (error) => {
			if (error.message.length > 0) {
				toast.error(error.message);
			}
			return;
		},
	});

	return (
		<div className="max-w-screen-xl mx-auto px-4 py-10">
			<div className="mb-4">
				<Link
					from="/listings/$listingId"
					to="/browse-cars"
					className={buttonStyles({
						appearance: "outline",
						size: "extra-small",
					})}
				>
					<IconChevronLeft />
					Back
				</Link>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
				<div>
					<Carousel
						className="w-full"
						opts={{
							align: "center",
							loop: true,
						}}
					>
						<Carousel.Content
							className="h-[300px] md:h-[500px]"
							items={data.images}
						>
							{(item) => (
								<Carousel.Item id={item.url} className="h-full">
									<CarouselImage
										item={item}
										make={data.make}
										model={data.model}
									/>
								</Carousel.Item>
							)}
						</Carousel.Content>

						<Carousel.Handler>
							<Carousel.Button slot="previous" />
							<Carousel.Button slot="next" />
						</Carousel.Handler>
					</Carousel>
				</div>
				<div>
					<div>
						<h1 className="text-xl md:text-2xl font-medium mb-2">
							{data.year} {data.make} {data.model}
						</h1>
						<h2 className="font-bold text-2xl">
							{formatCurrency({ amount: data.price })}
						</h2>
					</div>
					<div>
						<DescriptionList className="mt-6">
							<DescriptionList.Term>Mileage</DescriptionList.Term>
							<DescriptionList.Details>{data.mileage}</DescriptionList.Details>

							<DescriptionList.Term>Condition</DescriptionList.Term>
							<DescriptionList.Details className="capitalize">
								{data.condition.replace(/-/g, " ")}
							</DescriptionList.Details>

							<DescriptionList.Term>Transmission</DescriptionList.Term>
							<DescriptionList.Details className="capitalize">
								{data.transmission}
							</DescriptionList.Details>

							<DescriptionList.Term>Fuel Type</DescriptionList.Term>
							<DescriptionList.Details className="capitalize">
								{data.fuelType}
							</DescriptionList.Details>

							<DescriptionList.Term>Category</DescriptionList.Term>
							<DescriptionList.Details className="capitalize">
								{data.category.replace(/-/g, " ")}
							</DescriptionList.Details>

							<DescriptionList.Term>Location</DescriptionList.Term>
							<DescriptionList.Details>{data.location}</DescriptionList.Details>

							{data.vin && (
								<>
									<DescriptionList.Term>VIN</DescriptionList.Term>
									<DescriptionList.Details>{data.vin}</DescriptionList.Details>
								</>
							)}
						</DescriptionList>
						<div className="mt-6 flex flex-col md:flex-row gap-4">
							<Button appearance="outline" className="w-full">
								<IconHeart />
								Add to Wishlist
							</Button>
							<Button
								appearance="solid"
								className="w-full"
								onPress={() => purchaseCar()}
								isPending={isPending}
							>
								{({ isPending }) => (
									<>
										{isPending ? <Loader /> : <IconCart />}
										{isPending ? "Processing" : "Buy Now"}
									</>
								)}
							</Button>
						</div>
					</div>
				</div>
			</div>
			<Separator className="mt-4 md:hidden" />
			{data.description && (
				<div className="mt-4 md:mt-8">
					<h3 className="text-lg font-semibold mb-2">Description</h3>
					<p className="text-muted-fg">{data.description}</p>
				</div>
			)}
			<Separator className="my-4" />
			<div className="mt-4">
				<h3 className="text-lg font-semibold mb-2">Seller Information</h3>
				<Card className="px-4">
					<DescriptionList>
						<DescriptionList.Term>Business Name</DescriptionList.Term>
						<DescriptionList.Details>
							{data.seller.businessName}
						</DescriptionList.Details>

						<DescriptionList.Term>Contact Email</DescriptionList.Term>
						<DescriptionList.Details>
							{data.seller.businessEmail}
						</DescriptionList.Details>

						<DescriptionList.Term>Phone Number</DescriptionList.Term>
						<DescriptionList.Details>
							{data.seller.businessPhoneNumber}
						</DescriptionList.Details>
					</DescriptionList>
				</Card>
			</div>
		</div>
	);
};
