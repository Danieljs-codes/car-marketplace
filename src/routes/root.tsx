import {
	Outlet,
	ScrollRestoration,
	createRootRoute,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";
import type { ReactNode } from "react";
import { Providers } from "~/components/providers";
import globalStyle from "../styles/global.css?url";

export const Route = createRootRoute({
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

	component: RootComponent,
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
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
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}
