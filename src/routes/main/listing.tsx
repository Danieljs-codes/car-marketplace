import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main-layout-id/listings/$listingId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { listingId } = Route.useParams();

	return (
		<div className="max-w-screen-xl mx-auto px-4 py-10">
			<p>This is the route with ID</p>
			<span>{listingId}</span>
		</div>
	);
}
