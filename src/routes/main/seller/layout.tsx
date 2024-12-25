import { Outlet, useRouteContext } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "ui";
import AppSidebar from "~/components/app-sidebar";
import AppSidebarNav from "~/components/app-sidebar-nav";
import { $protectSellerRoute } from "~/server/actions/auth";

export const Route = createFileRoute("/_seller-layout-id")({
	beforeLoad: async () => {
		const { seller, user } = await $protectSellerRoute();

		return { seller, user };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { user } = Route.useRouteContext();
	return (
		<SidebarProvider>
			<AppSidebar auth={user} collapsible="dock" />
			<SidebarInset>
				<AppSidebarNav />
				<div className="p-4 lg:p-6">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
