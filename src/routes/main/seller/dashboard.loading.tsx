import { IconCar, IconMoneybag } from "justd-icons";
import { Card, Heading, Table } from "ui";
import { Skeleton } from "~/components/ui/skeleton";

const recentListingsLoading = Array.from({ length: 5 }).map((_, index) => ({
	id: `CAR${index + 1}`,
	make: "Loading...",
	model: "Loading...",
	price: 0,
	year: 0,
	status: "active" as const,
	createdAt: new Date(),
}));

export function DashboardLoading() {
	return (
		<div>
			<Heading className="mb-4">Dashboard</Heading>
			<div className="grid md:grid-cols-4 gap-4">
				{/* Revenue Card */}
				<Card>
					<Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title className="text-sm sm:text-sm font-medium">
							Total Revenue
						</Card.Title>
						<IconMoneybag className="size-4 text-muted-fg" />
					</Card.Header>
					<Card.Content>
						<Skeleton className="h-8 w-28" />
					</Card.Content>
				</Card>

				{/* Active Listings Card */}
				<Card>
					<Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title className="text-sm sm:text-sm font-medium">
							Active Listings
						</Card.Title>
						<IconCar className="size-4 text-muted-fg" />
					</Card.Header>
					<Card.Content>
						<Skeleton className="h-8 w-16" />
					</Card.Content>
				</Card>

				{/* Total Listings Card */}
				<Card>
					<Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title className="text-sm sm:text-sm font-medium">
							Total Listings
						</Card.Title>
						<IconCar className="size-4 text-muted-fg" />
					</Card.Header>
					<Card.Content>
						<Skeleton className="h-8 w-16" />
					</Card.Content>
				</Card>

				{/* Total Sold Card */}
				<Card>
					<Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title className="text-sm sm:text-sm font-medium">
							Total Sold
						</Card.Title>
						<IconCar className="size-4 text-muted-fg" />
					</Card.Header>
					<Card.Content>
						<Skeleton className="h-8 w-16" />
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
					<Table aria-label="Recent Listings Loading">
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
							items={recentListingsLoading}
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
									<Table.Cell>
										<Skeleton className="h-4 w-8" />
									</Table.Cell>
									<Table.Cell>
										<Skeleton className="h-4 w-20" />
									</Table.Cell>
									<Table.Cell>
										<Skeleton className="h-4 w-24" />
									</Table.Cell>
									<Table.Cell>
										<Skeleton className="h-4 w-20" />
									</Table.Cell>
									<Table.Cell>
										<Skeleton className="h-4 w-12" />
									</Table.Cell>
									<Table.Cell>
										<Skeleton className="h-6 w-16" shape="square" />
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
		</div>
	);
}
