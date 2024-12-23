import { Paystack } from "paystack-sdk";
import { serverOnly$ } from "vite-env-only/macros";

// biome-ignore lint/style/noNonNullAssertion: I know what i'm doing
export const paystack = serverOnly$(() => {
	const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY as string);
	return paystack;
})!;
