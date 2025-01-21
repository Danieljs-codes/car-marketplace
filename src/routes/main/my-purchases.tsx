import { createFileRoute } from "@tanstack/react-router";
import { IconMoneybag, IconShoppingBag, IconCar } from "justd-icons";
import { Badge, Card, Heading, Table } from "ui";
import { formatCurrency } from "~/utils/misc";
import { getUserPurchasesQueryOptions } from "~/utils/query-options";
import { useSuspenseQueryDeferred } from "~/utils/use-suspense-query-deferred";

export const Route = createFileRoute("/_main-layout-id/my-purchases")({
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(getUserPurchasesQueryOptions());
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { data } = useSuspenseQueryDeferred(getUserPurchasesQueryOptions());

	return (
		<div className="py-10 max-w-screen-xl mx-auto px-4">
			<Heading className="mb-8">My Purchases</Heading>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
				<Card>
					<Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title className="text-sm font-medium">Total Spent</Card.Title>
						<IconMoneybag className="size-4 text-muted-fg" />
					</Card.Header>
					<Card.Content>
						<div className="text-2xl font-bold">
							{formatCurrency({
								amount: data.reduce((acc, p) => acc + p.amount, 0),
								isKobo: true,
							})}
						</div>
					</Card.Content>
				</Card>

				<Card>
					<Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title className="text-sm font-medium">
							Cars Purchased
						</Card.Title>
						<IconCar className="size-4 text-muted-fg" />
					</Card.Header>
					<Card.Content>
						<div className="text-2xl font-bold">{data.length}</div>
					</Card.Content>
				</Card>

				<Card>
					<Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title className="text-sm font-medium">
							Active Orders
						</Card.Title>
						<IconShoppingBag className="size-4 text-muted-fg" />
					</Card.Header>
					<Card.Content>
						<div className="text-2xl font-bold">
							{data.filter((p) => p.status !== "completed").length}
						</div>
					</Card.Content>
				</Card>
			</div>

			{/* Purchase History Table */}
			<Card>
				<Table aria-label="Purchase History">
					<Table.Header>
						<Table.Column isRowHeader>Order ID</Table.Column>
						<Table.Column>Car</Table.Column>
						<Table.Column>Price</Table.Column>
						<Table.Column>Status</Table.Column>
						<Table.Column>Purchase Date</Table.Column>
					</Table.Header>
					<Table.Body items={data}>
						{(purchase) => (
							<Table.Row id={purchase.id}>
								<Table.Cell className="font-mono">{purchase.id}</Table.Cell>
								<Table.Cell>{`${purchase.car.year} ${purchase.car.make} ${purchase.car.model}`}</Table.Cell>
								<Table.Cell>
									{formatCurrency({
										amount: purchase.amount,
										isKobo: true,
									})}
								</Table.Cell>
								<Table.Cell>
									<Badge
										className="capitalize"
										intent={
											purchase.status === "completed" ? "success" : "warning"
										}
									>
										{purchase.status}
									</Badge>
								</Table.Cell>
								<Table.Cell>
									{purchase.createdAt.toLocaleDateString("en-NG", {
										day: "numeric",
										month: "long",
										year: "numeric",
									})}
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table>
			</Card>
		</div>
	);
}
