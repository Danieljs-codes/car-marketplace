import type { AnyRouter } from "@tanstack/react-router";

/// <reference types="vinxi/types/server" />
import { getRouterManifest } from "@tanstack/start/router-manifest";
import {
	createStartHandler,
	defaultStreamHandler,
} from "@tanstack/start/server";

import { createRouter } from "./router";

export type HandlerCallback<TRouter extends AnyRouter> = (ctx: {
	request: Request;
	router: TRouter;
	responseHeaders: Headers;
}) => Response | Promise<Response>;

const streamHandler: HandlerCallback<AnyRouter> = (ctx) => {
	ctx.router.serverSsr!.injectScript(
		() => `function initTheme() {
					if (typeof localStorage === 'undefined') return

					const localTheme = localStorage.getItem('theme')
					const preferTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
					const resolvedTheme = localTheme === null || localTheme === 'system' ? preferTheme : localTheme

          console.log('initTheme', resolvedTheme)

					if (localTheme === null) {
						localStorage.setItem('theme', 'system')
					}

					const html = document.documentElement
					const themes = ['light', 'dark']
					for (const theme of themes) {
						html.classList.remove(theme)
					}

					html.style.colorScheme = resolvedTheme
					html.classList.add(resolvedTheme)
					}

					initTheme()`,
	);
	return defaultStreamHandler(ctx);
};
export default createStartHandler({
	createRouter: () => {
		const router = createRouter();
		return router;
	},
	getRouterManifest,
})(streamHandler);
