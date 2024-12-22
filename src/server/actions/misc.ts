import { createServerFn } from "@tanstack/start";
import { deleteCookie, getCookie } from "vinxi/http";

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
