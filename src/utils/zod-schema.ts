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

export const createListingSchema = z.object({
	title: z.string().min(1, { message: "Title is required" }),
	make: z.string().min(1, { message: "Make is required" }),
	model: z.string().min(1, { message: "Model is required" }),
	year: z
		.number()
		.min(1886, { message: "Year must be after 1886 or later" })
		.max(new Date().getFullYear() + 1, { message: "Invalid year" }),
	condition: z.string().min(1, { message: "Condition is required" }),
	price: z
		.number()
		.min(1, { message: "Price must be greater than 0" })
		.transform((val) => val * 100), // Convert to kobo
	mileage: z.number().min(0, { message: "Mileage must be 0 or greater" }),
	transmission: z.enum(["automatic", "manual"], {
		errorMap: () => ({ message: "Please select a transmission type" }),
	}),
	fuelType: z.enum(["gasoline", "diesel", "electric", "hybrid"], {
		errorMap: () => ({ message: "Please select a fuel type" }),
	}),
	description: z.string().optional(),
	features: z.array(z.string()).optional(),
	images: z
		.array(z.string())
		.min(1, { message: "At least one image is required" }),
	location: z.string().min(1, { message: "Location is required" }),
	vin: z.string().optional(),
});
