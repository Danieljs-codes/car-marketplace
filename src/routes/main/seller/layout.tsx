import { Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "ui";
import AppSidebar from "~/components/app-sidebar";
import AppSidebarNav from "~/components/app-sidebar-nav";
import { $protectSellerRoute } from "~/server/actions/auth";

export const Route = createFileRoute("/_seller-layout-id")({
	beforeLoad: async () => {
		const { seller } = await $protectSellerRoute();

		return seller;
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<SidebarProvider>
			<AppSidebar collapsible="dock" />
			<SidebarInset>
				<AppSidebarNav />
				<div className="p-4 lg:p-6">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
