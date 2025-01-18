import {
	Outlet,
	ScrollRestoration,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";
import { useEffect, type ReactNode } from "react";
import { Providers } from "~/components/providers";
import globalStyle from "../styles/global.css?url";
import { $getToastCookie } from "~/server/actions/misc";
import { toast as showToast } from "sonner";
import { Toast } from "ui";
import type { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
		links: [
			// {
			// 	rel: "icon",
			// 	href: "/favicon.ico",
			// },
			{
				rel: "stylesheet",
				href: globalStyle,
			},
			// {
			// 	rel: "stylesheet",
			// 	href: fontsourceInter,
			// },
			// {
			// 	rel: "stylesheet",
			// 	href: fontsourceJetBrainsMono,
			// },
			// {
			// 	rel: "stylesheet",
			// 	href: fontsourceNotoSansTC,
			// },
		],
		scripts: import.meta.env.PROD
			? []
			: [
					{
						type: "module",
						children: `
					import RefreshRuntime from "/_build/@react-refresh"
					RefreshRuntime.injectIntoGlobalHook(window)
					window.$RefreshReg$ = () => {}
					window.$RefreshSig$ = () => (type) => type
				`,
					},
				],
	}),
	loader: async () => {
		const toast = await $getToastCookie();

		return { toast };
	},
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
});

function NotFoundComponent() {
	return <div className="font-sans">This cannot be found!!!!!!!!!!!!!</div>;
}

function RootComponent() {
	const { toast } = Route.useLoaderData();

	useEffect(() => {
		if (!toast) return;
		setTimeout(() => {
			showToast[toast.intent](toast.message, {
				description: toast.description,
			});
		}, 0);
	}, [toast]);

	return (
		<RootDocument>
			<ScrollRestoration />
			<Outlet />
			<Toast />
		</RootDocument>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://rsms.me/" />
				<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
				<Meta />
			</head>
			<body>
				<Providers>{children}</Providers>
				<Scripts />
			</body>
		</html>
	);
}
