import { createAPIFileRoute } from "@tanstack/start/api";
import { auth } from "~/utils/auth";

export const Route = createAPIFileRoute("/api/auth/$")({
	GET: ({ request, params }) => {
		return auth.handler(request);
	},
	POST: ({ request, params }) => {
		return auth.handler(request);
	},
});
