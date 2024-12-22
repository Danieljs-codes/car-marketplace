import { createServerFn } from "@tanstack/start";
import { auth } from "~/utils/auth";
import { signUpSchema } from "~/utils/zod-schema";
import { APIError } from "better-auth/api";
import { appendHeader, setResponseHeader } from "vinxi/http";
import { setToastCookie } from "./misc";
import { redirect } from "@tanstack/react-router";

export const $signUp = createServerFn({ method: "POST" })
	.validator((data: unknown) => signUpSchema.parse(data))
	.handler(async (ctx) => {
		const { email, password, firstName, lastName } = ctx.data;

		// Sign up user
		let response: Response;
		try {
			response = await auth.api.signUpEmail({
				body: {
					email,
					password,
					name: `${firstName} ${lastName}`,
				},
				asResponse: true,
			});

			console.log(response);
		} catch (error) {
			console.log(error);

			if (error instanceof APIError) {
				return {
					status: "error" as const,
					message: error.body.message,
				};
			}

			return {
				status: "error" as const,
				message: "Failed to sign up",
			};
		}

		// Get the headers returned from the response and set it manually
		const headers = response.headers;
		for (const [key, value] of headers.entries()) {
			appendHeader(key, value);
		}

		setToastCookie({
			intent: "success",
			message: "Signed up successfully",
		});

		throw redirect({
			to: "/",
		});
	});
