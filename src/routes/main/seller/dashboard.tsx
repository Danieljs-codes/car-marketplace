import { createFileRoute } from "@tanstack/react-router";
import { Heading } from "ui";

export const Route = createFileRoute("/_seller-layout-id/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Heading>This is the dashboard</Heading>;
}
