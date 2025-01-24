import { createMiddleware, createServerFn } from "@tanstack/start";
import { auth } from "~/utils/auth";
import { signInSchema, signUpSchema } from "~/utils/zod-schema";
import { APIError } from "better-auth/api";
import { appendHeader, getWebRequest } from "vinxi/http";
import { setCookieAndRedirect, setToastCookie } from "./misc";
import { redirect } from "@tanstack/react-router";
import { db } from "../db";
import schema from "../db/schema";
import { eq } from "drizzle-orm";

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
		} catch (error) {
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
		} catch (error) {
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
		if (!context.auth) {
			return {
				auth: null,
			};
		}
		const sellerProfile = await db
			.select()
			.from(schema.sellers)
			.where(eq(schema.sellers.userId, context.auth.user.id))
			.limit(1);

		if (sellerProfile.length === 0) {
			return {
				auth: {
					...context.auth,
					seller: null,
				},
			};
		}

		return {
			auth: {
				...context.auth,
				seller: sellerProfile[0],
			},
		};
	});

export const $protectBecomeASellerRoute = createServerFn({
	method: "GET",
})
	.middleware([validateUserMiddleware])
	.handler(async ({ context }) => {
		const sellerProfile = await db
			.select()
			.from(schema.sellers)
			.where(eq(schema.sellers.userId, context.auth.user.id))
			.limit(1);

		if (sellerProfile.length > 0) {
			throw setCookieAndRedirect({
				intent: "error",
				message: "You are already a seller",
				to: "/dashboard",
			});
		}

		return {
			auth: context.auth,
		};
	});

export const maybeSellerMiddleware = createMiddleware()
	.middleware([validateUserMiddleware])
	.server(async ({ context, next }) => {
		const sellerProfile = await db
			.select()
			.from(schema.sellers)
			.where(eq(schema.sellers.userId, context.auth.user.id))
			.limit(1);

		return next({
			context: {
				seller: sellerProfile.length > 0 ? sellerProfile[0] : null,
			},
		});
	});

export const validateSellerMiddleware = createMiddleware()
	.middleware([maybeSellerMiddleware])
	.server(async ({ context, next }) => {
		if (!context.seller) {
			throw setCookieAndRedirect({
				intent: "error",
				message: "You must be a seller to access this page",
				description: "Please become a seller to continue using the application",
				to: "/become-seller",
			});
		}

		return next({
			context: {
				seller: context.seller,
			},
		});
	});

export const $protectSellerRoute = createServerFn({ method: "GET" })
	.middleware([validateSellerMiddleware])
	.handler(async ({ context }) => {
		return {
			seller: context.seller,
			user: context.auth.user,
		};
	});

export const $validateLoggedInUser = createServerFn({ method: "GET" })
	.middleware([validateUserMiddleware])
	.handler(async ({ context }) => {
		return {
			user: context.auth.user,
		};
	});
