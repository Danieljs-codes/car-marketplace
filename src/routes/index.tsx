import { createFileRoute } from "@tanstack/react-router";
import { Blog } from "~/components/blog";
import { CategoryCarousel } from "~/components/category-carousel";
import { FeaturedVehicles } from "~/components/featured-vehicles";
import { Hero } from "~/components/hero";

export const Route = createFileRoute("/_main-layout-id/")({
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
