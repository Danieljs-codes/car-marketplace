import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { IconCheck, IconX } from "justd-icons";
import { Button, Card } from "ui";
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
	const { reference } = Route.useSearch();
	const navigate = useNavigate();

	return (
		<div className="min-h-[80vh] grid place-items-center p-4">
			<Card className="w-full max-w-md text-center p-6">
				{status === "loading" && (
					<>
						<div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
						<h1 className="text-xl font-semibold mt-4">Verifying Payment</h1>
						<p className="text-muted-fg mt-2">
							Please wait while we verify your payment...
						</p>
					</>
				)}

				{status === "success" && (
					<>
						<div className="w-16 h-16 rounded-full bg-success/10 grid place-items-center mx-auto">
							<IconCheck className="size-8 text-success" />
						</div>
						<h1 className="text-xl font-semibold mt-4">Payment Successful!</h1>
						<p className="text-muted-fg mt-2">
							Your transaction has been completed successfully.
						</p>
						<Button
							className="mt-6"
							onPress={() => navigate({ to: "/orders" })}
						>
							View Order
						</Button>
					</>
				)}

				{status === "error" && (
					<>
						<div className="w-16 h-16 rounded-full bg-danger/10 grid place-items-center mx-auto">
							<IconX className="size-8 text-danger" />
						</div>
						<h1 className="text-xl font-semibold mt-4">Payment Failed</h1>
						<p className="text-muted-fg mt-2">
							We couldn't verify your payment. Please try again or contact
							support.
						</p>
						<Button className="mt-6" onPress={() => navigate({ to: "/" })}>
							Return Home
						</Button>
					</>
				)}
			</Card>
		</div>
	);
}
