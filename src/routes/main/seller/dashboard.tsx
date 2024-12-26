import { useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { IconCar, IconMoneybag } from "justd-icons";
import { Card, Heading } from "ui";
import { formatCurrency } from "~/utils/misc";
import {
	getSellerActiveListingsQueryOptions,
	getSellerCarStatsQueryOptions,
	getTotalRevenueForSellerQueryOptions,
} from "~/utils/query-options";

export const Route = createFileRoute("/_seller-layout-id/dashboard")({
	loader: async ({ context }) => {
		context.queryClient.ensureQueryData(getSellerActiveListingsQueryOptions());
		context.queryClient.ensureQueryData(getTotalRevenueForSellerQueryOptions());
		context.queryClient.ensureQueryData(getSellerCarStatsQueryOptions());
	},
	component: RouteComponent,
});

function RouteComponent() {
	const [{ data: totalRevenue }, { data: activeListings }, { data: carStats }] =
		useSuspenseQueries({
			queries: [
				getTotalRevenueForSellerQueryOptions(),
				getSellerActiveListingsQueryOptions(),
				getSellerCarStatsQueryOptions(),
			],
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
							{formatCurrency(totalRevenue)}
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
		</div>
	);
}
