import z from "zod";

export const signUpSchema = z.object({
	firstName: z
		.string()
		.min(2, { message: "First name must be at least 2 characters" }),
	lastName: z
		.string()
		.min(2, { message: "Last name must be at least 2 characters" }),
	email: z.string().email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters" })
		.regex(/[a-zA-Z][0-9]|[0-9][a-zA-Z]/, {
			message: "Password must include letters and numbers",
		}),
});

export const signInSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z.string().min(1, { message: "Password is required" }),
	rememberMe: z.boolean().default(false),
});

export const becomeASellerSchema = z.object({
	businessName: z
		.string()
		.min(2, { message: "Business name must be at least 2 characters" }),
	accountNumber: z.string().length(10, {
		message: "Account number must be 10 digits",
	}),
	// We need the bank code but the user needs to select a bank that is why the error message says "Bank is required" instead of "Bank code is required"
	bankCode: z.string().min(1, {
		message: "Bank is required",
	}),
	businessPhoneNumber: z
		.string()
		.min(1, {
			message: "Business phone number is required",
		})
		.length(11, {
			message: "Business phone number must be 11 digits",
		}),
	businessEmail: z.string().email({ message: "Invalid email address" }),
});
