import { Breadcrumbs, Separator, SidebarNav, SidebarTrigger } from "ui";
import { ThemeSwitcher } from "./theme-switcher";
import { isMatch, useMatches } from "@tanstack/react-router";
import type { ValidRoutes } from "~/server/actions/misc";

export default function AppSidebarNav() {
	const matches = useMatches();
	const matchesWithCrumbs = matches.filter((match) =>
		isMatch(match, "loaderData.crumb"),
	);

	const items = matchesWithCrumbs.map(({ pathname, loaderData }) => {
		return {
			href: pathname as ValidRoutes,
			label: loaderData?.crumb,
		};
	});

	const breadcrumbsItems = [
		{
			href: "/dashboard",
			label: "Dashboard",
		},
		...items,
	];

	return (
		<SidebarNav>
			<span className="flex gap-x-4 items-center">
				<SidebarTrigger className="-mx-2" />
				<Separator className="hidden h-6 @md:block" orientation="vertical" />
				<Breadcrumbs className="hidden @md:flex">
					{breadcrumbsItems.map((item, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<Breadcrumbs.Item key={index} href={item.href}>
							{item.label}
						</Breadcrumbs.Item>
					))}
				</Breadcrumbs>
			</span>

			<div className="flex gap-x-2 items-center ml-auto">
				<ThemeSwitcher appearance="plain" />
			</div>
		</SidebarNav>
	);
}
