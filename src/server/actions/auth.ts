import { createMiddleware, createServerFn } from "@tanstack/start";
import { auth } from "~/utils/auth";
import { signInSchema, signUpSchema } from "~/utils/zod-schema";
import { APIError } from "better-auth/api";
import { appendHeader, getWebRequest, setResponseHeader } from "vinxi/http";
import { setCookieAndRedirect, setToastCookie } from "./misc";
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

export const $signIn = createServerFn({ method: "POST" })
	.validator((data: unknown) => signInSchema.parse(data))
	.handler(async (ctx) => {
		const { email, password, rememberMe } = ctx.data;

		// Sign in user
		let response: Response;
		try {
			response = await auth.api.signInEmail({
				body: {
					email,
					password,
					rememberMe,
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
				message: "Failed to sign in",
			};
		}

		// Get the headers returned from the response and set it manually
		const headers = response.headers;
		console.log(response.headers);

		for (const [key, value] of headers.entries()) {
			appendHeader(key, value);
		}

		setToastCookie({
			intent: "success",
			message: "Signed in successfully",
		});

		throw redirect({
			to: "/",
		});
	});

export const maybeUserMiddleware = createMiddleware().server(
	async ({ next }) => {
		const request = getWebRequest();

		const authData = await auth.api.getSession({
			headers: request.headers,
		});
		return next({
			context: {
				auth: authData,
			},
		});
	},
);

export const validateUserMiddleware = createMiddleware()
	.middleware([maybeUserMiddleware])
	.server(async ({ context, next }) => {
		if (!context.auth) {
			throw setCookieAndRedirect({
				intent: "error",
				message: "You must be signed in to access this page",
				description: "Please sign in to continue using the application",
				to: "/sign-in",
			});
		}

		return next({
			context: {
				auth: context.auth,
			},
		});
	});

export const $getAuthStatus = createServerFn({ method: "GET" })
	.middleware([maybeUserMiddleware])
	.handler(async ({ context }) => {
		return {
			auth: context.auth,
		};
	});
