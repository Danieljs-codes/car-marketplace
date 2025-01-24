import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { IconHeart, IconLocation, IconOpenLink2 } from "justd-icons";
import { buttonStyles, Card, Heading } from "ui";
import { z } from "zod";
import { IconSpeedometer } from "~/components/icons/speedometer";
import { getUserWishlistQueryOptions } from "~/utils/query-options";
import { formatCurrency } from "~/utils/misc";
import { Blurhash } from "react-blurhash";

export const Route = createFileRoute("/_main-layout-id/wishlist")({
	validateSearch: zodValidator(
		z.object({
			page: fallback(z.number(), 1).default(1),
			limit: fallback(z.number(), 10).default(10),
		}),
	),
	loaderDeps: ({ search: { limit, page } }) => ({ page, limit }),
	loader: async ({ context, deps }) => {
		context.queryClient.ensureQueryData(getUserWishlistQueryOptions(deps));
	},
	component: RouteComponent,
});

function RouteComponent() {
	const search = Route.useSearch();
	const { data } = useSuspenseQuery(getUserWishlistQueryOptions(search));
	const hasItems = data.items.length > 0;

	if (!hasItems) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
				<IconHeart className="size-12 text-muted-fg mb-4" />
				<h1 className="text-xl md:text-2xl font-bold text-fg mb-2">
					Your wishlist is empty
				</h1>
				<p className="text-muted-fg text-center text-sm md:text-base mb-6 max-w-[50ch]">
					Start saving cars you're interested in by clicking the heart icon on
					any listing.
				</p>
				<Link
					to="/browse-cars"
					className={buttonStyles({
						intent: "primary",
						size: "small",
					})}
				>
					Browse Cars
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-screen-xl mx-auto px-4 py-10">
			<div className="mb-8">
				<Heading>My Wishlist</Heading>
				<p className="text-muted-fg mt-1">
					You have {data.pagination.total} saved{" "}
					{data.pagination.total === 1 ? "car" : "cars"}
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{data.items.map(({ listing }) => (
					<Card key={listing.id} className="overflow-hidden">
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
									className="object-cover w-full h-full relative z-10 transition-opacity duration-300"
									onLoad={(e) => {
										e.currentTarget.style.opacity = "1";
									}}
									style={{ opacity: 0 }}
								/>
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
										<span>{listing.mileage} km</span>
									</div>
									<div className="flex items-center gap-1.5 text-muted-fg">
										<IconLocation className="w-4 h-4" />
										<span className="truncate">{listing.location}</span>
									</div>
								</div>
								<div className="flex flex-wrap gap-x-2 gap-y-1 mt-3 text-sm text-muted-fg">
									<span>{listing.year}</span>
									<span>•</span>
									<span className="capitalize">{listing.transmission}</span>
									<span>•</span>
									<span className="capitalize">{listing.fuelType}</span>
								</div>
								<div className="flex justify-end mt-4">
									<Link
										to="/listings/$listingId"
										params={{ listingId: listing.id }}
										className={buttonStyles({
											intent: "secondary",
											appearance: "outline",
											size: "small",
										})}
									>
										<IconOpenLink2 />
										View Details
									</Link>
								</div>
							</div>
						</Card.Content>
					</Card>
				))}
			</div>
		</div>
	);
}
