import { Redis } from "@upstash/redis";
import { serverOnly$ } from "vite-env-only/macros";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
export const redis = serverOnly$(
	new Redis({
		url: "https://pleasing-tiger-43841.upstash.io",
		token: "AatBAAIjcDFjNTAxOTdiNTZkOTU0MTU0YWZlMzA1MmVlZDg4Y2MyMXAxMA",
	}),
)!;
