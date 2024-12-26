// app.config.ts
import { join } from "node:path";
import { defineConfig } from "@tanstack/start/config";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import {
  rootRoute,
  route,
  index,
  layout
} from "@tanstack/virtual-file-routes";
import { envOnlyMacros } from "vite-env-only";
var config = {
  appDirectory: "src",
  autoOpenBrowser: false
};
var routes = rootRoute("root.tsx", [
  layout("main-layout-id", "main/layout.tsx", [
    index("index.tsx"),
    route("become-seller", "main/become-seller.tsx")
  ]),
  layout("seller-layout-id", "main/seller/layout.tsx", [
    route("dashboard", "main/seller/dashboard.tsx"),
    route("listings", "main/seller/listings/layout.tsx", [
      index
    ])
  ]),
  layout("auth-layout-id", "auth/layout.tsx", [
    route("sign-in", "auth/sign-in.tsx"),
    route("sign-up", "auth/sign-up.tsx")
  ])
]);
var app = defineConfig({
  routers: {
    api: {
      entry: join(config.appDirectory, "entry-api.ts")
    },
    ssr: {
      entry: join(config.appDirectory, "entry-server.ts")
    },
    client: {
      entry: join(config.appDirectory, "entry-client.tsx")
    }
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
        'function RouteComponent() { return "Hello %%tsrPath%%!" }\n'
      ].join(""),
      apiTemplate: [
        'import { json } from "@tanstack/start";\n',
        "%%tsrImports%%\n\n",
        `%%tsrExportStart%%{ GET: ({ request, params }) => { return json({ message:'Hello "%%tsrPath%%"!' }) }}%%tsrExportEnd%%
`
      ].join("")
    }
  },
  vite: {
    plugins: [
      viteTsConfigPaths({
        projects: ["./tsconfig.json"]
      }),
      envOnlyMacros(),
      tailwindcss()
    ]
  }
});
var app_config_default = app;
export {
  app_config_default as default
};
