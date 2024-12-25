import { Paystack } from "paystack-sdk";
import { serverOnly$ } from "vite-env-only/macros";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
export const paystack = serverOnly$(
	new Paystack(process.env.PAYSTACK_SECRET_KEY as string),
)!;
