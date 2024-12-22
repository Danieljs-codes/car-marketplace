import { createFileRoute } from "@tanstack/react-router";
import { Logo } from "~/components/logo";
import { TextField } from "~/components/ui/text-field";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-svh flex items-center justify-center w-full p-4">
			<Logo />
		</div>
	);
}
