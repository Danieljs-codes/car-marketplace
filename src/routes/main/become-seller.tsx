import { createFileRoute } from "@tanstack/react-router";
import { Card } from "ui";

export const Route = createFileRoute("/_main-layout-id/become-seller")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<Card>
				<Card.Header>
					<Card.Title className="mb-1">Become a Car Seller!</Card.Title>
					<Card.Description>
						Unlock the potential of your vehicle. List it now and reach
						thousands of buyers!
					</Card.Description>
				</Card.Header>
			</Card>
		</div>
	);
}
