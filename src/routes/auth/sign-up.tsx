import { createFileRoute } from "@tanstack/react-router";
import { Button, Link, TextField } from "ui";

export const Route = createFileRoute("/_auth-layout-id/sign-up")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<div>
				<h1 className="text-xl text-center font-bold tracking-tight leading-tight">
					Sign up for an account to start buying and selling tickets
				</h1>
				<p className="text-center text-sm  mt-2 max-w-md mx-auto text-muted-fg mt-2 px-3">
					No account yet? No problem! Sign up and start buying and selling
					tickets immediately.
				</p>
			</div>
			<div className="mt-6">
				<form>
					<div className="space-y-5">
						<TextField label="First Name" placeholder="John" />
						<TextField label="Last Name" placeholder="Doe" />
						<TextField
							label="Email Address"
							placeholder="john.doe@example.com"
							type="email"
						/>
						<TextField
							label="Password"
							placeholder="••••••••"
							isRevealable
							type="password"
						/>
					</div>
					<Button className="w-full mt-6" size="small">
						Sign up
					</Button>
				</form>
				<p className="text-center text-sm  mx-auto text-muted-fg mt-4">
					Already have an account?{" "}
					<Link href="/sign-in" className="text-primary">
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
}
