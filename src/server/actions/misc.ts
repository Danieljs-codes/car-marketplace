import { createServerFn } from "@tanstack/start";
import { deleteCookie, getCookie, setCookie } from "vinxi/http";
import { serverOnly$ } from "vite-env-only/macros";

export const $getToastCookie = createServerFn({ method: "GET" }).handler(
	async () => {
		const toast = getCookie("toast");

		if (!toast) return null;

		const data = JSON.parse(toast) as {
			intent: "success" | "error" | "info" | "warning";
			message: string;
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
	}) => {
		const data = JSON.stringify(toast);
		return setCookie("toast", data);
	},
)!;
