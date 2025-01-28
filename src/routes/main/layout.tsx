import { Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import AppNavbar from "~/components/app-navbar";
import { Footer } from "~/components/footer";
import { $getAuthStatus } from "~/server/actions/auth";

export const Route = createFileRoute("/_main-layout-id")({
	beforeLoad: async () => {
		const { auth } = await $getAuthStatus();

		return { auth };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { auth } = Route.useRouteContext();

	return (
		<AppNavbar auth={auth}>
			<Outlet />
			<Footer />
		</AppNavbar>
	);
}
