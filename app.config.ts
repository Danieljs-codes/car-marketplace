import { join } from "node:path";

import { defineConfig } from "@tanstack/start/config";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { rootRoute, route, index, layout } from "@tanstack/virtual-file-routes";
import { envOnlyMacros } from "vite-env-only";
import tailwindcss from "@tailwindcss/vite";

const config = {
	appDirectory: "src",
	autoOpenBrowser: false,
};

const routes = rootRoute("root.tsx", [
	layout("main-layout-id", "main/layout.tsx", [
		index("index.tsx"),
		route("become-seller", "main/become-seller.tsx"),
		route("browse-cars", "main/browse-cars.tsx"),
		route("wishlist", "main/wishlist.tsx"),
		route("my-purchases", "main/my-purchases.tsx"),
		route("listings/$listingId", "main/listing.tsx"),
		route("payment/callback", "main/payment.tsx"),
	]),
	layout("seller-layout-id", "main/seller/layout.tsx", [
		route("dashboard", "main/seller/dashboard.tsx"),
		route("listings", [
			index("main/seller/listings/listings.tsx"),
			route("new", "main/seller/listings/new.tsx"),
		]),
		route("orders", "main/seller/orders.tsx"),
	]),
	layout("auth-layout-id", "auth/layout.tsx", [
		route("sign-in", "auth/sign-in.tsx"),
		route("sign-up", "auth/sign-up.tsx"),
	]),
]);

const app = defineConfig({
	server: {
		preset: "vercel",
	},

	routers: {
		api: {
			entry: join(config.appDirectory, "entry-api.ts"),
		},
		ssr: {
			entry: join(config.appDirectory, "entry-server.ts"),
		},
		client: {
			entry: join(config.appDirectory, "entry-client.tsx"),
		},
	},
	tsr: {
		appDirectory: config.appDirectory,
		generatedRouteTree: join(config.appDirectory, "route-tree.gen.ts"),
		quoteStyle: "single",
		semicolons: false,
		virtualRouteConfig: routes,
		customScaffolding: {
			routeTemplate: [
				"%%tsrImports%%\n\n",
				"%%tsrExportStart%%{\n component: RouteComponent\n }%%tsrExportEnd%%\n\n",
				'function RouteComponent() { return "Hello %%tsrPath%%!" }\n',
			].join(""),
			apiTemplate: [
				'import { json } from "@tanstack/start";\n',
				"%%tsrImports%%\n\n",
				"%%tsrExportStart%%{ GET: ({ request, params }) => { return json({ message:'Hello \"%%tsrPath%%\"!' }) }}%%tsrExportEnd%%\n",
			].join(""),
		},
		autoCodeSplitting: true,
	},
	vite: {
		plugins: [
			tailwindcss(),
			viteTsConfigPaths({
				projects: ["./tsconfig.json"],
			}),
			envOnlyMacros(),
		],
	},
});

// https://github.com/nksaraf/vinxi/issues/34#issuecomment-1871437097
// https://github.com/nksaraf/vinxi/blob/b0ccb64d3c37488050eb9411be4290ea466c3eba/packages/vinxi/lib/dev-server.js#L225
// app.hooks.hook('app:dev:server:listener:created', ({ listener }) => {
//   if (!config.autoOpenBrowser) return
//   exec(`start ${listener.url}`)
// })

// https://discord.com/channels/719702312431386674/1238170697650405547/1300589573080092723
// function withGlobalMiddleware(app: App) {
//   return {
//     ...app,
//     config: {
//       ...app.config,
//       routers: app.config.routers.map((router) => ({
//         ...router,
//         middleware: router.target !== 'server' ? undefined : join(config.appDirectory, 'global-middleware.ts'),
//       })),
//     },
//   }
// }

export default app;
