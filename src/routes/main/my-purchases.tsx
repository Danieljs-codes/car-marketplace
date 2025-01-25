import { createFileRoute, Link } from "@tanstack/react-router";
import { IconMoneybag, IconShoppingBag, IconCar } from "justd-icons";
import { Badge, Card, Heading, Table, Skeleton, buttonStyles } from "ui";
import { $validateLoggedInUser } from "~/server/actions/auth";
import { formatCurrency } from "~/utils/misc";
import { getUserPurchasesQueryOptions } from "~/utils/query-options";
import { useSuspenseQueryDeferred } from "~/utils/use-suspense-query-deferred";

const loadingDemoArray = Array.from({ length: 5 }).map((_, i) => ({
	id: `loading-${i}`,
	car: {
		year: "Loading",
		make: "Loading",
		model: "Loading",
	},
	amount: 0,
	status: "Loading",
	createdAt: new Date(),
}));

function LoadingState() {
	return (
		<div className="py-10 max-w-screen-xl mx-auto px-4">
			<Heading className="mb-8">My Purchases</Heading>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
				{Array.from({ length: 3 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<Card key={i}>
						<Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="size-4" />
						</Card.Header>
						<Card.Content>
							<Skeleton className="h-8 w-32" />
						</Card.Content>
					</Card>
				))}
			</div>

			<Card>
				<Table aria-label="Purchase History Loading">
					<Table.Header>
						<Table.Column isRowHeader>Order ID</Table.Column>
						<Table.Column>Car</Table.Column>
						<Table.Column>Price</Table.Column>
						<Table.Column>Status</Table.Column>
						<Table.Column>Purchase Date</Table.Column>
					</Table.Header>
					<Table.Body items={loadingDemoArray}>
						{(items) => (
							<Table.Row id={items.id}>
								<Table.Cell>
									<Skeleton className="h-4 w-24" />
								</Table.Cell>
								<Table.Cell>
									<Skeleton className="h-4 w-48" />
								</Table.Cell>
								<Table.Cell>
									<Skeleton className="h-4 w-24" />
								</Table.Cell>
								<Table.Cell>
									<Skeleton className="h-6 w-20" />
								</Table.Cell>
								<Table.Cell>
									<Skeleton className="h-4 w-32" />
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table>
			</Card>
		</div>
	);
}

export const Route = createFileRoute("/_main-layout-id/my-purchases")({
	loader: async ({ context }) => {
		await $validateLoggedInUser();
		context.queryClient.ensureQueryData(getUserPurchasesQueryOptions());
	},
	component: RouteComponent,
	pendingComponent: LoadingState,
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
					<Table.Body
						renderEmptyState={() => (
							<div className="flex flex-col py-4 justify-center items-center">
								<Heading level={3} className="mb-1.5">
									No purchases yet
								</Heading>
								<p className="text-muted-fg max-w-[50ch] text-center text-pretty">
									You haven't made any purchases yet. When you do, they will
									appear here.
								</p>
								<Link
									className={buttonStyles({ size: "small", className: "mt-4" })}
									to="/browse-cars"
								>
									Browse Cars
								</Link>
							</div>
						)}
						items={data}
					>
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
