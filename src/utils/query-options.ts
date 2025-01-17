import { queryOptions } from "@tanstack/react-query";
import {
	$getPaginatedListingsForSeller,
	$getPaginatedOrdersForSeller,
	$getRecentListingsForSeller,
	$getSellerActiveListings,
	$getSellerCarStats,
	$getTotalRevenueForSeller,
} from "~/server/actions/seller";
import { $getFiltersContent } from "~/server/actions/filter";
import type { validSearchParam } from "~/server/actions/filter";
import type { z } from "zod";

export interface PaystackBankResponse {
	message: string;
	status: boolean;
	data: Array<{
		id: number;
		name: string;
		slug: string;
		code: string;
		longcode: string;
		gateway: string;
		pay_with_bank: boolean;
		supports_transfer: boolean;
		active: boolean;
		country: string;
		currency: string;
		type: string;
		is_deleted: boolean;
		createdAt: string;
		updatedAt: string;
	}>;
}

export const getAllBanksQueryOptions = () =>
	queryOptions({
		queryKey: ["getAllBanks"],
		queryFn: async () => {
			const response = await fetch(
				`https://api.paystack.co/bank?country=nigeria`,
				{
					headers: {
						Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
					},
				},
			);
			const data: PaystackBankResponse = await response.json();

			return data.data;
		},
		select: (data) =>
			data.reduce<PaystackBankResponse["data"]>((uniqueBanks, currentBank) => {
				const existingBank = uniqueBanks.find(
					(bank) => bank.code === currentBank.code,
				);
				if (!existingBank) {
					uniqueBanks.push(currentBank);
					return uniqueBanks;
				}

				return uniqueBanks;
			}, []),
	});

export const getSellerActiveListingsQueryOptions = () =>
	queryOptions({
		queryKey: ["getSellerTotalListings"],
		queryFn: async () => {
			const response = await $getSellerActiveListings();

			return response;
		},
	});

export const getTotalRevenueForSellerQueryOptions = () =>
	queryOptions({
		queryKey: ["getTotalRevenueForSeller"],
		queryFn: async () => {
			const response = await $getTotalRevenueForSeller();

			return response;
		},
	});

export const getSellerCarStatsQueryOptions = () =>
	queryOptions({
		queryKey: ["getSellerCarStats"],
		queryFn: async () => {
			const response = await $getSellerCarStats();

			return response;
		},
	});

export const getRecentListingsForSellerQueryOptions = () =>
	queryOptions({
		queryKey: ["getRecentListingsForSeller"],
		queryFn: async () => {
			const response = await $getRecentListingsForSeller();

			return response;
		},
	});

export const getPaginatedListingsForSellerQueryOptions = ({
	page,
	pageSize,
}: { page: number; pageSize: number }) =>
	queryOptions({
		queryKey: ["getPaginatedListingsForSeller", page, pageSize],
		queryFn: async () => {
			const response = await $getPaginatedListingsForSeller({
				data: { page, pageSize },
			});

			return response;
		},
	});

export const getPaginatedOrdersForSellerQueryOptions = ({
	page,
	pageSize,
	search,
}: {
	page: number;
	pageSize: number;
	search: string;
}) =>
	queryOptions({
		queryKey: ["seller", "orders", { page, pageSize, search }],
		queryFn: async () => {
			const response = await $getPaginatedOrdersForSeller({
				data: { page, pageSize, search },
			});

			return response;
		},
	});

export const getFilteredListingsQueryOptions = (
	filters: z.infer<typeof validSearchParam>,
) =>
	queryOptions({
		queryKey: ["getFilteredListings", filters],
		queryFn: async () => {
			const response = await $getFiltersContent({ data: filters });
			return response;
		},
	});
