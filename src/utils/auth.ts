import { db } from "~/server/db";
import schema from "~/server/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		usePlural: true,
		schema,
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		autoSignIn: true,
	},
	emailVerification: {
		sendOnSignUp: true,
		sendVerificationEmail: async (url) => {
			console.log(`Verification URL: ${url.url}`);
		},
	},
	trustedOrigins: ["http://localhost:3000", "http://192.168.250.157:3000"],
});
