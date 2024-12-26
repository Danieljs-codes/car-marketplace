import { Breadcrumbs, Separator, SidebarNav, SidebarTrigger } from "ui";
import { ThemeSwitcher } from "./theme-switcher";

export default function AppSidebarNav() {
	return (
		<SidebarNav>
			<span className="flex gap-x-4 items-center">
				<SidebarTrigger className="-mx-2" />
				<Separator className="hidden h-6 @md:block" orientation="vertical" />
				<Breadcrumbs className="hidden @md:flex">
					<Breadcrumbs.Item href="/">Dashboard</Breadcrumbs.Item>
					<Breadcrumbs.Item>Newsletter</Breadcrumbs.Item>
				</Breadcrumbs>
			</span>

			<div className="flex gap-x-2 items-center ml-auto">
				<ThemeSwitcher appearance="plain" />
			</div>
		</SidebarNav>
	);
}
