import { createFileRoute } from "@tanstack/react-router";
import { Badge, Button, Card, Heading, SearchField, Table } from "ui";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import {
	formatCurrency,
	getOrderStatusBadgeIntent,
	type OrderStatus,
} from "~/utils/misc";
import { DateFormatter } from "@internationalized/date";
import { IconChevronLeft, IconChevronRight } from "justd-icons";
import { getPaginatedOrdersForSellerQueryOptions } from "~/utils/query-options";
import { useState } from "react";
import { OrdersLoading } from "./orders.loading";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const ordersSearchSchema = z.object({
	page: fallback(z.number(), 1).default(1),
	pageSize: fallback(z.number(), 10).default(10),
	search: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/_seller-layout-id/orders")({
	validateSearch: zodValidator(ordersSearchSchema),
	loaderDeps: ({ search: { page, pageSize, search } }) => ({
		page,
		pageSize,
		search,
	}),
	loader: async ({ context, deps: { page, pageSize, search } }) => {
		context.queryClient.ensureQueryData(
			getPaginatedOrdersForSellerQueryOptions({ page, pageSize, search }),
		);

		return {
			crumb: "Orders",
		};
	},
	component: RouteComponent,
	errorComponent: ErrorComponent,
});

function ErrorComponent() {
	return <div>Error</div>;
}

function RouteComponent() {
	const { page, pageSize, search } = Route.useSearch();
	const [searchTerm, setSearchTerm] = useState(search);
	const navigate = Route.useNavigate();

	const { data, isPending, error, isFetching } = useQuery({
		...getPaginatedOrdersForSellerQueryOptions({ page, pageSize, search }),
		placeholderData: keepPreviousData,
	});

	if (isPending) {
		return <OrdersLoading />;
	}

	if (error) {
		// This would manually trigger the error boundary which is what we want
		throw new Error("Error loading orders");
	}

	const dateFormatter = new DateFormatter("en-NG", {
		year: "numeric",
		month: "long",
		day: "2-digit",
	});

	return (
		<div>
			<Heading className="mb-8">Orders</Heading>
			<form
				className="mb-4 flex items-center justify-center gap-4"
				onSubmit={(e) => {
					e.preventDefault();
					navigate({ search: (prev) => ({ ...prev, search: searchTerm }) });
				}}
			>
				<SearchField
					isPending={isFetching && !data}
					value={searchTerm}
					onChange={setSearchTerm}
					onClear={() =>
						navigate({ search: (prev) => ({ ...prev, search: "" }) })
					}
					className="flex-1"
				/>
				<Button type="submit">Search</Button>
			</form>
			<Card>
				<Table aria-label="Orders">
					<Table.Header>
						<Table.Column isRowHeader>Vehicle</Table.Column>
						<Table.Column>Buyer Name</Table.Column>
						<Table.Column>Buyer Email</Table.Column>
						<Table.Column>Amount</Table.Column>
						<Table.Column>Platform Fee</Table.Column>
						<Table.Column>Net Amount</Table.Column>
						<Table.Column>Status</Table.Column>
						<Table.Column>Date</Table.Column>
					</Table.Header>
					<Table.Body
						items={data.orders}
						renderEmptyState={() => (
							<div className="flex flex-col items-center justify-center p-4">
								<h2 className="text-lg font-bold mb-2">
									{search ? "No Results Found" : "No Orders Yet"}
								</h2>
								<p className="text-muted-fg text-sm text-center max-w-[400px]">
									{search ? (
										<>
											No orders match your search "
											<span className="font-semibold">{search}</span>". Try
											adjusting your search terms.
										</>
									) : (
										"You haven't received any orders yet. When customers purchase your vehicles, they'll appear here."
									)}
								</p>
							</div>
						)}
					>
						{(order) => (
							<Table.Row id={order.id}>
								<Table.Cell className="">
									{order.listing.year} {order.listing.make}{" "}
									{order.listing.model}
								</Table.Cell>
								<Table.Cell className="">{order.buyer.name}</Table.Cell>
								<Table.Cell className="">{order.buyer.email}</Table.Cell>
								<Table.Cell className="font-medium">
									{formatCurrency({ amount: order.amount })}
								</Table.Cell>
								<Table.Cell className="">
									{formatCurrency({ amount: order.platformFee })}
								</Table.Cell>
								<Table.Cell className="">
									{formatCurrency({ amount: order.netAmount })}
								</Table.Cell>
								<Table.Cell className="">
									<Badge
										className="capitalize"
										intent={getOrderStatusBadgeIntent(
											order.status as OrderStatus,
										)}
										shape="square"
									>
										{order.status.toLowerCase()}
									</Badge>
								</Table.Cell>
								<Table.Cell className="">
									{dateFormatter.format(order.createdAt)}
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table>
			</Card>
			<div className="flex items-center justify-between mt-4">
				<Button
					size="extra-small"
					appearance="outline"
					isDisabled={page === 1}
					onPress={() => navigate({ search: { page: page - 1, pageSize } })}
				>
					<IconChevronLeft />
					Previous
				</Button>
				<p className="text-sm text-muted-fg">
					Page {page} of {data.totalPages}
				</p>
				<Button
					size="extra-small"
					appearance="outline"
					isDisabled={page >= data.totalPages}
					onPress={() => navigate({ search: { page: page + 1, pageSize } })}
				>
					Next
					<IconChevronRight />
				</Button>
			</div>
		</div>
	);
}
