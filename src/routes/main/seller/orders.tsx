import { createFileRoute } from "@tanstack/react-router";
import { Badge, Button, Card, Heading, Table } from "ui";
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

const ordersSearchSchema = z.object({
	page: fallback(z.number(), 1).default(1),
	pageSize: fallback(z.number(), 10).default(10),
});

export const Route = createFileRoute("/_seller-layout-id/orders")({
	validateSearch: ordersSearchSchema,
	loaderDeps: ({ search: { page, pageSize } }) => ({ page, pageSize }),
	loader: async ({ context, deps: { page, pageSize } }) => {
		context.queryClient.ensureQueryData(
			getPaginatedOrdersForSellerQueryOptions({ page, pageSize }),
		);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { page, pageSize } = Route.useSearch();
	const navigate = Route.useNavigate();

	const { data } = useSuspenseQueryDeferred(
		getPaginatedOrdersForSellerQueryOptions({ page, pageSize }),
	);

	const dateFormatter = new DateFormatter("en-NG", {
		year: "numeric",
		month: "long",
		day: "2-digit",
	});

	return (
		<div>
			<Heading className="mb-8">Orders</Heading>
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
								<h2 className="text-lg font-bold mb-2">No Orders Yet</h2>
								<p className="text-muted-fg text-sm text-center max-w-[400px]">
									You haven't received any orders yet. When customers purchase
									your vehicles, they'll appear here.
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
