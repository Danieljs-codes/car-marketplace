import { CatchNotFound, createFileRoute, Link } from "@tanstack/react-router";
import { buttonStyles } from "ui";
import { Listing } from "~/components/listing";
import { getCarDetailsQueryOptions } from "~/utils/query-options";
import { ListingLoading } from "./listing.loading";

export const Route = createFileRoute("/_main-layout-id/listings/$listingId")({
	loader: async ({ context, params }) => {
		context.queryClient.ensureQueryData(
			getCarDetailsQueryOptions(params.listingId),
		);
	},
	component: RouteComponent,
	notFoundComponent: NotFoundComponent,
	pendingComponent: ListingLoading,
});

function NotFoundComponent() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[50vh] md:min-h-[80vh] p-8">
			<h1 className="text-xl md:text-3xl font-bold text-fg mb-2 md:mb-4">
				Listing Not Found
			</h1>
			<p className="text-muted-fg text-center text-sm md:text-base mb-4 md:mb-6 text-pretty max-w-[60ch]">
				Sorry, the car listing you're looking for doesn't exist or has been
				removed. This could be because the listing has expired, was taken down
				by the seller, or the URL might be incorrect. Please try browsing our
				other available listings.
			</p>
			<Link
				className={buttonStyles({
					intent: "primary",
					size: "small",
				})}
				to="/browse-cars"
			>
				Browse Other Listing
			</Link>
		</div>
	);
}

function RouteComponent() {
	return (
		<CatchNotFound fallback={() => <NotFoundComponent />}>
			<Listing />
		</CatchNotFound>
	);
}
