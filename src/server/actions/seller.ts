import { createServerFn } from "@tanstack/start";
import { becomeASellerSchema } from "~/utils/zod-schema";
import { maybeSellerMiddleware, validateUserMiddleware } from "./auth";
import { paystack } from "../paystack";
import { PERCENTAGE_CHARGE, setCookieAndRedirect } from "./misc";
import { omit } from "~/utils/misc";
import schema from "../db/schema";
import { db } from "../db";

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

export const $createSellerAccount = createServerFn({
	method: "POST",
})
	.middleware([maybeSellerMiddleware])
	.validator((data: unknown) => becomeASellerSchema.parse(data))
	.handler(async ({ context, data }) => {
		if (context.seller) {
			throw setCookieAndRedirect({
				intent: "error",
				message: "You are already a seller",
				description:
					"You cannot create a seller account if you are already a seller",
				to: "/dashboard",
			});
		}

		// Create a paystack subaccount
		const { data: subAccount } = await paystack.subAccount.create({
			account_number: data.accountNumber,
			settlement_bank: data.bankCode,
			business_name: data.businessName,
			primary_contact_phone: data.businessPhoneNumber,
			percentage_charge: PERCENTAGE_CHARGE,
			description: "This is a seller account",
			primary_contact_email: data.businessEmail,
			primary_contact_name: data.businessName,
		});

		if (!subAccount) {
			return {
				status: "error" as const,
				message: "Failed to create seller account",
			};
		}

		// Create a new seller profile in the database

		await db.insert(schema.sellers).values({
			userId: context.auth.user.id,
			businessEmail: data.businessEmail,
			businessPhoneNumber: data.businessPhoneNumber,
			businessName: data.businessName,
			paystackSubaccountId: subAccount.subaccount_code,
		});

		throw setCookieAndRedirect({
			intent: "success",
			message: "You are now a seller",
			description: "You can now list your cars for sale",
			to: "/dashboard",
		});
	});
