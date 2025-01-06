import { type ParseRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { deleteCookie, getCookie, setCookie } from "vinxi/http";
import { serverOnly$ } from "vite-env-only/macros";
import type { routeTree } from "~/route-tree.gen";

export const $getToastCookie = createServerFn({ method: "GET" }).handler(
	async () => {
		const toast = getCookie("toast");

		if (!toast) return null;

		const data = JSON.parse(toast) as {
			intent: "success" | "error" | "info" | "warning";
			message: string;
			description?: string;
		};

		deleteCookie("toast");
		return data;
	},
);

// biome-ignore lint/style/noNonNullAssertion: <explanation>
export const setToastCookie = serverOnly$(
	(toast: {
		intent: "success" | "error" | "info" | "warning";
		message: string;
		description?: string;
	}) => {
		const data = JSON.stringify(toast);
		return setCookie("toast", data);
	},
)!;

export type ValidRoutes = ParseRoute<typeof routeTree>["fullPath"];

// biome-ignore lint/style/noNonNullAssertion: I know what i'm doing
export const setCookieAndRedirect = serverOnly$(
	(toast: {
		intent: "success" | "error" | "info" | "warning";
		message: string;
		description?: string;
		to: ValidRoutes;
	}) => {
		setToastCookie(toast);
		throw redirect({
			to: toast.to,
		});
	},
)!;

// Percentage charge is 2%
export const PERCENTAGE_CHARGE = 2;
