import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { $verifyPayment } from "~/server/actions/payment";

export const searchParamSchema = z.object({
	reference: z.string(),
	trxref: z.string(),
});

export const Route = createFileRoute("/_main-layout-id/payment/callback")({
	validateSearch: searchParamSchema,

	beforeLoad: async ({ search }) => {
		if (!search.reference || !search.trxref) {
			throw redirect({ to: "/" });
		}
	},
	loaderDeps: ({ search: { reference, trxref } }) => ({ reference, trxref }),
	loader: async ({ deps }) => {
		await $verifyPayment({ data: deps });
	},
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();

	return <div>Loading...</div>;
}
