import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
	baseURL: `https://spherule-car.vercel.app`,
});
