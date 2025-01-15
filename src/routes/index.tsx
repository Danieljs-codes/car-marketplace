import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "~/components/hero";

export const Route = createFileRoute("/_main-layout-id/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<Hero />
		</div>
	);
}
