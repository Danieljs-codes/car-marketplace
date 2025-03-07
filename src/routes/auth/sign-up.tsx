import { createFileRoute } from "@tanstack/react-router";
import { Button, Link, Note, TextField, Loader } from "ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useController, useForm } from "react-hook-form";
import { signUpSchema } from "~/utils/zod-schema";
import { useMutation } from "@tanstack/react-query";
import { $signUp } from "~/server/actions/auth";
import type { z } from "zod";

export const Route = createFileRoute("/_auth-layout-id/sign-up")({
	component: RouteComponent,
});

function RouteComponent() {
	const {
		control,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
		},
	});

	const { mutate: signUp, isPending: isSubmitting } = useMutation({
		mutationKey: ["sign-up"],
		mutationFn: async (data: z.infer<typeof signUpSchema>) => {
			const response = await $signUp({
				data,
			});

			if (response.status === "error") {
				throw new Error(response.message);
			}

			return response;
		},

		onError: (err) => {
			setError("root", {
				message: err.message,
			});
		},
	});

	const firstNameField = useController({ control, name: "firstName" });
	const lastNameField = useController({ control, name: "lastName" });
	const emailField = useController({ control, name: "email" });
	const passwordField = useController({ control, name: "password" });

	const onSubmit = handleSubmit((data) => {
		signUp(data);
	});

	return (
		<div>
			<div>
				<h1 className="text-xl text-center font-bold tracking-tight leading-tight">
					Your Ticket to Events Starts Here – Get Started!
				</h1>
				<p className="text-center text-sm  mt-2 max-w-md mx-auto text-muted-fg mt-2 px-3 first-letter:uppercase">
					our journey to unforgettable events starts with a simple sign-up.
				</p>
			</div>
			<div className="mt-6">
				<form className="w-full" onSubmit={onSubmit}>
					{errors.root?.message && (
						<Note className="mb-4" intent="danger">
							{errors.root?.message}
						</Note>
					)}
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
					<Button
						isPending={isSubmitting}
						type="submit"
						className="w-full mt-6"
						size="small"
					>
						{({ isPending }) => (
							<>
								{isPending && <Loader variant="spin" />}
								{isPending ? "Signing up..." : "Sign up"}
							</>
						)}
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
