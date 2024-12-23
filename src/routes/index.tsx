import { createFileRoute } from "@tanstack/react-router";
import { Logo } from "~/components/logo";

export const Route = createFileRoute("/_main-layout-id/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-svh flex items-center justify-center w-full p-4">
			<Logo />
		</div>
	);
}
