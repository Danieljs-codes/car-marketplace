import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useController, useForm } from "react-hook-form";
import { Button, Checkbox, Loader, Note, TextField } from "ui";
import type { z } from "zod";
import { $signIn } from "~/server/actions/auth";
import { signInSchema } from "~/utils/zod-schema";

export const Route = createFileRoute("/_auth-layout-id/sign-in")({
	component: RouteComponent,
});

function RouteComponent() {
	const {
		control,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
	});

	const { mutate: signIn, isPending: isSubmitting } = useMutation({
		mutationKey: ["sign-in"],
		mutationFn: async (data: z.infer<typeof signInSchema>) => {
			const response = await $signIn({
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

	const emailField = useController({ control, name: "email" });
	const passwordField = useController({ control, name: "password" });
	const rememberMeField = useController({ control, name: "rememberMe" });

	const onSubmit = handleSubmit((data) => {
		signIn(data);
	});

	return (
		<div>
			<div>
				<h1 className="text-xl text-center font-bold tracking-tight leading-tight">
					Access the Best Tickets in Town
				</h1>
				<p className="text-center text-sm  mt-2 max-w-md mx-auto text-muted-fg mt-2 px-3">
					Get closer to the events you love. Sign in to get started!
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
						<Checkbox
							label="Remember me"
							isSelected={rememberMeField.field.value}
							onChange={rememberMeField.field.onChange}
							onBlur={rememberMeField.field.onBlur}
							name={rememberMeField.field.name}
							isDisabled={rememberMeField.field.disabled}
							isInvalid={!!errors.rememberMe}
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
								{isPending ? "Signing in..." : "Sign in"}
							</>
						)}
					</Button>
				</form>
				<p className="text-center text-sm  mx-auto text-muted-fg mt-4">
					Don't have an account?{" "}
					<Link href="/sign-up" className="text-primary">
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
}
