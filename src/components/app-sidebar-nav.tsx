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

	const newItems = [
		{ href: "/dashboard", label: "Dashboard" } as const,
		...items,
	];

	console.log(newItems);

	// TODO: FIX THE BUG HERE
	return (
		<SidebarNav>
			<span className="flex gap-x-4 items-center">
				<SidebarTrigger className="-mx-2" />
				<Separator className="hidden h-6 @md:block" orientation="vertical" />
				<Breadcrumbs items={newItems} className="hidden @md:flex">
					{(item) => (
						<>
							<Breadcrumbs.Item>{item.label}</Breadcrumbs.Item>
						</>
					)}
				</Breadcrumbs>
			</span>

			<div className="flex gap-x-2 items-center ml-auto">
				<ThemeSwitcher appearance="plain" />
			</div>
		</SidebarNav>
	);
}
