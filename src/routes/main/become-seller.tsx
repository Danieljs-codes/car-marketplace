import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useController, useForm } from "react-hook-form";
import { Button, Card, ComboBox, Modal, TextField, Loader } from "ui";
import type { z } from "zod";
import { $protectBecomeASellerRoute } from "~/server/actions/auth";
import {
	$createSellerAccount,
	$validateBankDetails,
} from "~/server/actions/seller";
import { getAllBanksQueryOptions } from "~/utils/query-options";
import { becomeASellerSchema } from "~/utils/zod-schema";

export const Route = createFileRoute("/_main-layout-id/become-seller")({
	beforeLoad: async ({ context }) => {
		const { auth } = await $protectBecomeASellerRoute();

		return {
			user: auth.user,
		};
	},
	loader: async ({ context }) => {
		// await context.queryClient.ensureQueryData(getAllBanksQueryOptions());
	},
	component: RouteComponent,
});

function RouteComponent() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [bankDetails, setBankDetails] = useState<null | {
		accountName: string;
		accountNumber: string;
	}>();
	const { data: banks } = useSuspenseQuery(getAllBanksQueryOptions());
	const { user } = Route.useRouteContext();
	const { formState, control, handleSubmit, setError } = useForm<
		z.infer<typeof becomeASellerSchema>
	>({
		resolver: zodResolver(becomeASellerSchema),
		defaultValues: {
			businessName: "",
			accountNumber: "",
			bankCode: "",
			businessEmail: user.email,
			businessPhoneNumber: "",
		},
	});

	const { mutateAsync: validateBankDetails, isPending: isValidating } =
		useMutation({
			mutationKey: ["validate-bank-details"],
			mutationFn: async (data: z.infer<typeof becomeASellerSchema>) => {
				const response = await $validateBankDetails({
					data,
				});

				if (response.status === "error") {
					throw new Error(response.message);
				}

				return response;
			},

			onError: (err) => {
				setError("accountNumber", { message: err.message });
				setError("bankCode", { message: err.message }, { shouldFocus: true });
			},
		});
	const { mutate: createSellerProfile, isPending: isCreating } = useMutation({
		mutationKey: ["create-seller"],
		mutationFn: async (data: z.infer<typeof becomeASellerSchema>) => {
			const response = await $createSellerAccount({
				data,
			});

			if (response.status === "error") {
				throw new Error(response.message);
			}

			return response;
		},

		onError: (err) => {
			console.log(err);
			// toast.error(err.message);
		},

		onSettled: () => {
			setIsModalOpen(false);
			setBankDetails(null);
		},
	});

	const businessNameField = useController({
		control,
		name: "businessName",
	});
	const businessEmailField = useController({
		control,
		name: "businessEmail",
	});
	const businessPhoneNumberField = useController({
		control,
		name: "businessPhoneNumber",
	});
	const accountNumberField = useController({
		control,
		name: "accountNumber",
	});
	const bankCodeField = useController({
		control,
		name: "bankCode",
	});

	const onSubmit = handleSubmit((data) => {
		setBankDetails(null);
		validateBankDetails(data).then((res) => {
			setIsModalOpen(true);
			setBankDetails({
				accountName: res.data.account_name,
				accountNumber: res.data.account_number,
			});
		});
	});

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<Card>
				<Card.Header>
					<Card.Title className="mb-1">Become a Car Seller!</Card.Title>
					<Card.Description>
						Unlock the potential of your vehicle. List it now and reach
						thousands of buyers!
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<form onSubmit={onSubmit}>
						<div className="space-y-5">
							<TextField
								label="Business Name"
								{...businessNameField.field}
								isInvalid={!!formState.errors.businessName}
								errorMessage={formState.errors.businessName?.message}
							/>
							<TextField
								label="Business Email"
								{...businessEmailField.field}
								isInvalid={!!formState.errors.businessEmail}
								errorMessage={formState.errors.businessEmail?.message}
							/>
							<TextField
								label="Business Phone Number"
								{...businessPhoneNumberField.field}
								isInvalid={!!formState.errors.businessPhoneNumber}
								errorMessage={formState.errors.businessPhoneNumber?.message}
								maxLength={11}
							/>
							<TextField
								label="Account Number"
								{...accountNumberField.field}
								isInvalid={!!formState.errors.accountNumber}
								errorMessage={formState.errors.accountNumber?.message}
								minLength={10}
								maxLength={10}
								inputMode="numeric"
							/>
							<ComboBox
								label="Select your bank"
								{...bankCodeField.field}
								selectedKey={bankCodeField.field.value}
								onSelectionChange={(val) => {
									bankCodeField.field.onChange(val);
								}}
								isInvalid={!!formState.errors.bankCode}
								errorMessage={formState.errors.bankCode?.message}
							>
								<ComboBox.Input className="capitalize" />
								<ComboBox.List items={banks}>
									{(item) => (
										<ComboBox.Option
											id={item.code}
											textValue={item.name.toLowerCase()}
										>
											<span className="truncate capitalize text-sm">
												{item.name.toLowerCase()}
											</span>
										</ComboBox.Option>
									)}
								</ComboBox.List>
							</ComboBox>
						</div>
						<Button
							size="small"
							className="mt-6 w-full"
							type="submit"
							isPending={isValidating}
						>
							{({ isPending }) => (
								<>
									{isPending && <Loader variant="spin" />}
									{isPending ? "Becoming a seller" : "Become a seller"}
								</>
							)}
						</Button>
					</form>
				</Card.Content>
			</Card>
			{bankDetails && (
				<Modal>
					<Modal.Content
						role="alertdialog"
						isOpen={isModalOpen}
						onOpenChange={(val) => {
							setBankDetails(null);
							setIsModalOpen(val);
						}}
						isBlurred
					>
						<Modal.Header>
							<Modal.Title>Bank Details</Modal.Title>
							<Modal.Description>
								Validate the account name and number matches the details you
								provided.
							</Modal.Description>
						</Modal.Header>
						<Modal.Body>
							<div>
								<span className="text-sm text-muted-fg">Account Name:</span>{" "}
								<p className="font-medium inline capitalize">
									{bankDetails.accountName.toLowerCase()}
								</p>
							</div>
							<div>
								<span className="text-sm text-muted-fg">Account Number:</span>{" "}
								<p className="font-medium inline">
									{bankDetails.accountNumber}
								</p>
							</div>
						</Modal.Body>
						<Modal.Footer>
							<Modal.Close size="small" appearance="outline">
								Cancel
							</Modal.Close>
							<Button
								isPending={isCreating}
								size="small"
								onPress={() => {
									createSellerProfile({
										accountNumber: bankDetails.accountNumber,
										bankCode: bankCodeField.field.value,
										businessEmail: businessEmailField.field.value,
										businessName: businessNameField.field.value,
										businessPhoneNumber: businessPhoneNumberField.field.value,
									});
								}}
							>
								{({ isPending }) => (
									<>
										{isPending && <Loader variant="spin" />}
										{isPending ? "Continuing" : "Continue"}
									</>
								)}
							</Button>
						</Modal.Footer>
					</Modal.Content>
				</Modal>
			)}
		</div>
	);
}
