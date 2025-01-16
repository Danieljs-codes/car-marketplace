import { createFileRoute } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { validCarCategories } from "~/utils/misc";

const validSearchParam = z.object({
	category: fallback(z.enum([...validCarCategories, "all"]), "all").default(
		"all",
	),
});

export const Route = createFileRoute("/_main-layout-id/browse-cars")({
	validateSearch: zodValidator(validSearchParam),
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="py-10 max-w-screen-xl mx-auto px-4">
			This is the page where users can browse cars
		</div>
	);
}
