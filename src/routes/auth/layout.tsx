import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Logo } from "~/components/logo";

export const Route = createFileRoute("/_auth-layout-id")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="pt-20 px-4">
			<div className="flex items-center justify-center mb-6">
				<Logo />
			</div>
			<div className="max-w-sm mx-auto">
				<Outlet />
			</div>
		</div>
	);
}
