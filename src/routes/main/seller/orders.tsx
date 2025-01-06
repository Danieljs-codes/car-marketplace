import { createFileRoute } from "@tanstack/react-router";
import { Badge, Button, Card, Heading, SearchField, Table } from "ui";
import { z } from "zod";
import { fallback } from "@tanstack/zod-adapter";
import {
	formatCurrency,
	getOrderStatusBadgeIntent,
	type OrderStatus,
} from "~/utils/misc";
import { DateFormatter } from "@internationalized/date";
import { IconChevronLeft, IconChevronRight } from "justd-icons";
import { getPaginatedOrdersForSellerQueryOptions } from "~/utils/query-options";
import { useSuspenseQueryDeferred } from "~/utils/use-suspense-query-deferred";
import { useState } from "react";

const ordersSearchSchema = z.object({
	page: fallback(z.number(), 1).default(1),
	pageSize: fallback(z.number(), 10).default(10),
	search: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/_seller-layout-id/orders")({
	validateSearch: ordersSearchSchema,
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
});

function RouteComponent() {
	const { page, pageSize, search } = Route.useSearch();
	const [searchTerm, setSearchTerm] = useState(search);
	const navigate = Route.useNavigate();

	const { data, isSuspending } = useSuspenseQueryDeferred(
		getPaginatedOrdersForSellerQueryOptions({ page, pageSize, search }),
	);

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
					isPending={isSuspending}
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
						<Table.Column isRowHeader>Order ID</Table.Column>
						<Table.Column>Vehicle</Table.Column>
						<Table.Column>Buyer Name</Table.Column>
						<Table.Column>Buyer Email</Table.Column>
						<Table.Column>Amount</Table.Column>
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
								<Table.Cell>{order.id}</Table.Cell>
								<Table.Cell>
									{order.listing.make} {order.listing.model}{" "}
									{order.listing.year}
								</Table.Cell>
								<Table.Cell>{order.buyer.name}</Table.Cell>
								<Table.Cell>{order.buyer.email}</Table.Cell>
								<Table.Cell className="font-medium">
									{formatCurrency({ amount: order.amount })}
								</Table.Cell>
								<Table.Cell>
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
								<Table.Cell>{dateFormatter.format(order.createdAt)}</Table.Cell>
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
