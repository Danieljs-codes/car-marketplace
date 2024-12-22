import { createFileRoute } from "@tanstack/react-router";
import { Button, Link, TextField } from "ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useController, useForm } from "react-hook-form";
import { signUpSchema } from "~/utils/zod-schema";

export const Route = createFileRoute("/_auth-layout-id/sign-up")({
	component: RouteComponent,
});

function RouteComponent() {
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
		},
	});

	const firstNameField = useController({ control, name: "firstName" });
	const lastNameField = useController({ control, name: "lastName" });
	const emailField = useController({ control, name: "email" });
	const passwordField = useController({ control, name: "password" });

	const onSubmit = handleSubmit((data) => {
		console.log(data);
	});

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
				<form className="w-full" onSubmit={onSubmit}>
					<div className="space-y-5">
						<TextField
							label="First Name"
							placeholder="John"
							{...firstNameField.field}
							isInvalid={!!errors.firstName}
							errorMessage={errors.firstName?.message}
						/>
						<TextField
							label="Last Name"
							placeholder="Doe"
							{...lastNameField.field}
							isInvalid={!!errors.lastName}
							errorMessage={errors.lastName?.message}
						/>
						<TextField
							label="Email Address"
							placeholder="john.doe@example.com"
							type="email"
							{...emailField.field}
							isInvalid={!!errors.email}
							errorMessage={errors.email?.message}
						/>
						<TextField
							label="Password"
							placeholder="••••••••"
							isRevealable
							type="password"
							{...passwordField.field}
							isInvalid={!!errors.password}
							errorMessage={errors.password?.message}
						/>
					</div>
					<Button isPending type="submit" className="Ola mt-6" size="small">
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
