import { createServerFn } from "@tanstack/start";
import { becomeASellerSchema } from "~/utils/zod-schema";
import { validateUserMiddleware } from "./auth";
import { paystack } from "../paystack";

export const $validateBankDetails = createServerFn({
	method: "POST",
})
	.middleware([validateUserMiddleware])
	.validator((data: unknown) => becomeASellerSchema.parse(data))
	.handler(async ({ context, data }) => {
		const { accountNumber, bankCode } = data;

		const { data: accountDetails, status } =
			await paystack.verification.resolveAccount({
				account_number: accountNumber,
				bank_code: bankCode,
			});

		if (!accountDetails) {
			return {
				status: "error" as const,
				message: "Invalid account details",
			};
		}

		return {
			status: "success" as const,
			message: "Account details are valid",
			data: accountDetails,
		};
	});
