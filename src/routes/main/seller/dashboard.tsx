import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { IconCar, IconMoneybag } from "justd-icons";
import { Badge, Card, Heading, Table } from "ui";
import {
	formatCurrency,
	getBadgeIntent,
	type ListingStatus,
} from "~/utils/misc";
import {
	getRecentListingsForSellerQueryOptions,
	getSellerActiveListingsQueryOptions,
	getSellerCarStatsQueryOptions,
	getTotalRevenueForSellerQueryOptions,
} from "~/utils/query-options";
import { DateFormatter } from "@internationalized/date";

export const Route = createFileRoute("/_seller-layout-id/dashboard")({
	loader: async ({ context }) => {
		context.queryClient.ensureQueryData(getSellerActiveListingsQueryOptions());
		context.queryClient.ensureQueryData(getTotalRevenueForSellerQueryOptions());
		context.queryClient.ensureQueryData(getSellerCarStatsQueryOptions());
		context.queryClient.ensureQueryData(
			getRecentListingsForSellerQueryOptions(),
		);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const [
		{ data: totalRevenue },
		{ data: activeListings },
		{ data: carStats },
		{ data: recentListings },
	] = useSuspenseQueries({
		queries: [
			getTotalRevenueForSellerQueryOptions(),
			getSellerActiveListingsQueryOptions(),
			getSellerCarStatsQueryOptions(),
			getRecentListingsForSellerQueryOptions(),
		],
	});

	const dateFormatter = new DateFormatter("en-NG", {
		year: "numeric",
		month: "long",
		day: "2-digit",
	});

	return (
		<div>
			<Heading className="mb-4">Dashboard</Heading>
			<div className="grid md:grid-cols-4 gap-4">
				<Card>
					<Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title className="text-sm font-medium text-muted-fg">
							Total Revenue
						</Card.Title>
						<IconMoneybag className="size-4 text-muted-fg" />
					</Card.Header>
					<Card.Content>
						<div className="text-2xl font-bold">
							{formatCurrency({ amount: totalRevenue })}
						</div>
					</Card.Content>
				</Card>
				<Card>
					<Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title className="text-sm font-medium">
							Active Listings
						</Card.Title>
						<IconCar className="size-4 text-muted-fg" />
					</Card.Header>
					<Card.Content>
						<div className="text-2xl font-bold">{activeListings}</div>
					</Card.Content>
				</Card>
				<Card>
					<Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title className="text-sm font-medium">
							Total Listings
						</Card.Title>
						<IconCar className="size-4 text-muted-fg" />
					</Card.Header>
					<Card.Content>
						<div className="text-2xl font-bold">{carStats.totalListed}</div>
					</Card.Content>
				</Card>
				<Card>
					<Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title className="text-sm font-medium ">Total Sold</Card.Title>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							width={20}
							height={20}
							fill={"none"}
							className="text-muted-fg size-4"
						>
							<path
								d="M18 6C19.3001 6.1287 20.1752 6.41956 20.8284 7.07691C22 8.25596 22 10.1536 22 13.9489C22 17.7442 22 19.6419 20.8284 20.8209C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8209C2 19.6419 2 17.7442 2 13.9489C2 10.1536 2 8.25596 3.17157 7.07691C3.82475 6.41956 4.69989 6.1287 6 6"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
							/>
							<path
								d="M9.5 5.5C9.99153 6.0057 11.2998 8 12 8M14.5 5.5C14.0085 6.0057 12.7002 8 12 8M12 8V2"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M18.5078 14H18.4988"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M5.50781 14H5.49883"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M14.5 14C14.5 15.3807 13.3807 16.5 12 16.5C10.6193 16.5 9.5 15.3807 9.5 14C9.5 12.6193 10.6193 11.5 12 11.5C13.3807 11.5 14.5 12.6193 14.5 14Z"
								stroke="currentColor"
								strokeWidth="1.5"
							/>
						</svg>
					</Card.Header>
					<Card.Content>
						<div className="text-2xl font-bold">{carStats.totalSold}</div>
					</Card.Content>
				</Card>
			</div>
			{/* Recent seller listings */}
			<div className="mt-8">
				<Card.Header
					className="px-0 pt-0"
					title="Latest Car Listings"
					description="Keep track of your recently added cars and their performance."
				/>
				<Card>
					<Table aria-label="Recent Listings">
						<Table.Header>
							<Table.Column isRowHeader>ID</Table.Column>
							<Table.Column>Make</Table.Column>
							<Table.Column>Model</Table.Column>
							<Table.Column>Price</Table.Column>
							<Table.Column>Year</Table.Column>
							<Table.Column>Status</Table.Column>
							<Table.Column>Listed At</Table.Column>
						</Table.Header>
						<Table.Body
							items={recentListings}
							renderEmptyState={() => (
								<div className="flex flex-col items-center justify-center p-4">
									<h2 className="text-lg font-bold mb-2">
										No Listings Available
									</h2>
									<p className="text-muted-fg text-sm text-center max-w-[400px]">
										It looks like you haven't added any cars yet. Create your
										first listing today to connect with buyers and grow your
										sales!
									</p>
								</div>
							)}
						>
							{(item) => (
								<Table.Row id={item.id}>
									<Table.Cell>{item.id}</Table.Cell>
									<Table.Cell>{item.make}</Table.Cell>
									<Table.Cell>{item.model}</Table.Cell>
									<Table.Cell className="font-medium">
										{formatCurrency({ amount: item.price })}
									</Table.Cell>
									<Table.Cell>{item.year}</Table.Cell>
									<Table.Cell>
										<Badge
											className="capitalize"
											intent={getBadgeIntent(item.status as ListingStatus)}
											shape="square"
										>
											{item.status.toLowerCase()}
										</Badge>
									</Table.Cell>
									<Table.Cell>
										{dateFormatter.format(item.createdAt)}
									</Table.Cell>
								</Table.Row>
							)}
						</Table.Body>
					</Table>
				</Card>
			</div>
		</div>
	);
}
