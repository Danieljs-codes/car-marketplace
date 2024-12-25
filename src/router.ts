import { QueryClient } from "@tanstack/react-query";
import {
	createRouter as createTanStackRouter,
	isRedirect,
} from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { lazy } from "react";

import { routeTree } from "~/route-tree.gen";

export interface RouterContext {
	queryClient: QueryClient;
}

export function createRouter() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				// With SSR, we usually want to set some default staleTime
				// above 0 to avoid refetching immediately on the client
				staleTime: 60 * 1000,
			},
		},
	});

	const router = createTanStackRouter({
		routeTree,
		context: {
			queryClient,
		},
		search: {
			strict: true,
		},
		defaultPreload: "intent",
		// Since we're using React Query, we don't want loader calls to ever be stale
		// This will ensure that the loader is always called when the route is preloaded or visited
		defaultPreloadStaleTime: 0,
	});

	function handleRedirectError(error: Error) {
		if (isRedirect(error)) {
			router.navigate(
				router.resolveRedirect({
					...error,
					_fromLocation: router.state.location,
				}),
			);
		}
	}

	// handle redirect without useServerFn when using tanstack query
	queryClient.getQueryCache().config.onError = handleRedirectError;
	queryClient.getMutationCache().config.onError = handleRedirectError;

	// expose router and query client to window for use outside React (e.g. for Better Auth)
	if (typeof window !== "undefined") {
		window.getRouter = () => router;
		window.getQueryClient = () => queryClient;
	}

	return routerWithQueryClient(router, queryClient);
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}

declare global {
	interface Window {
		getRouter: () => ReturnType<typeof createRouter>;
		getQueryClient: () => QueryClient;
	}
}

// export const RouterDevtools = import.meta.env.PROD
// 	? () => null
// 	: lazy(() =>
// 			import("@tanstack/react-router-devtools").then((mod) => ({
// 				default: mod.TanStackRouterDevtools,
// 			})),
// 		);

// export const QueryDevtools = import.meta.env.PROD
// 	? () => null
// 	: lazy(() =>
// 			import("@tanstack/react-query-devtools").then((mod) => ({
// 				default: mod.ReactQueryDevtools,
// 			})),
// 		);
