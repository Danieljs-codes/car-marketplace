import { createFileRoute } from "@tanstack/react-router";
import { Blog } from "~/components/blog";
import { CategoryCarousel } from "~/components/category-carousel";
import { FeaturedVehicles } from "~/components/featured-vehicles";
import { Hero } from "~/components/hero";
import { getHomePageCarListingsQueryOptions } from "~/utils/query-options";

export const Route = createFileRoute("/_main-layout-id/")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(
			getHomePageCarListingsQueryOptions(),
		);
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<Hero />
			<FeaturedVehicles />
			<CategoryCarousel />
			<Blog />
		</div>
	);
}
