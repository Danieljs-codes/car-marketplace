import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, buttonStyles, Card, Heading, Menu, Table } from "ui";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { getPaginatedListingsForSellerQueryOptions } from "~/utils/query-options";
import { useSuspenseQueryDeferred } from "~/utils/use-suspense-query-deferred";
import {
	formatCurrency,
	getBadgeIntent,
	type ListingStatus,
} from "~/utils/misc";
import { DateFormatter } from "@internationalized/date";
import { IconDotsVertical, IconFolderDelete, IconPencilBox } from "justd-icons";

const listingsSearchSchema = z.object({
	page: fallback(z.number(), 1).default(1),
	pageSize: fallback(z.number(), 10).default(10),
});

export const Route = createFileRoute("/_seller-layout-id/listings")({
	validateSearch: zodValidator(listingsSearchSchema),
	loaderDeps: ({ search: { page, pageSize } }) => ({ page, pageSize }),
	loader: async ({ context, deps: { page, pageSize } }) => {
		context.queryClient.ensureQueryData(
			getPaginatedListingsForSellerQueryOptions({ page, pageSize }),
		);
	},
	component: RouteComponent,
});

const dummyListings = Array.from({ length: 10 }).map((_, i) => ({
	price: (i + 1) * 1000 * (1 + Math.random() * 0.1),
	id: `listing-${i + 1}`,
	make: ["Toyota", "Honda", "Ford", "Nissan"][Math.floor(Math.random() * 4)],
	model: ["Corolla", "Civic", "Focus", "Sentra"][Math.floor(Math.random() * 4)],
	year: 2015 + Math.floor(Math.random() * 8),
	status: ["active", "sold", "expired"][Math.floor(Math.random() * 3)] as
		| "active"
		| "sold"
		| "expired",
	createdAt: new Date(
		Date.now() - i * 24 * 60 * 60 * 1000 + Math.floor(Math.random() * 100000),
	),
}));

function RouteComponent() {
	const { data: listings } = useSuspenseQueryDeferred(
		getPaginatedListingsForSellerQueryOptions({ page: 1, pageSize: 10 }),
	);

	const dateFormatter = new DateFormatter("en-NG", {
		year: "numeric",
		month: "long",
		day: "2-digit",
	});

	return (
		<div>
			<div className="flex justify-between items-center mb-8">
				<Heading>Listings</Heading>
				<Link
					className={buttonStyles({
						intent: "primary",
						size: "small",
					})}
					to="."
				>
					Add new listing
				</Link>
			</div>
			<div>
				<Card>
					<Table aria-label="Listings">
						<Table.Header>
							<Table.Column isRowHeader>ID</Table.Column>
							<Table.Column>Price</Table.Column>
							<Table.Column>Make</Table.Column>
							<Table.Column>Model</Table.Column>
							<Table.Column>Year</Table.Column>
							<Table.Column>Status</Table.Column>
							<Table.Column>Listed At</Table.Column>
							<Table.Column />
						</Table.Header>
						<Table.Body
							items={dummyListings}
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
									<Table.Cell className="font-medium">
										{formatCurrency(item.price)}
									</Table.Cell>
									<Table.Cell className="capitalize">
										{item.make.toLowerCase()}
									</Table.Cell>
									<Table.Cell>{item.model}</Table.Cell>
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
									<Table.Cell>
										<div className="flex justify-end ml-4 sm:ml-0">
											<Menu>
												<Menu.Trigger className="">
													<IconDotsVertical />
												</Menu.Trigger>
												<Menu.Content
													popoverClassName="min-w-40"
													placement="left"
													respectScreen={false}
													showArrow
												>
													<Menu.Item className="text-sm">
														<IconPencilBox />
														Edit
													</Menu.Item>
													<Menu.Item className="text-sm">
														<IconFolderDelete />
														Delete
													</Menu.Item>
												</Menu.Content>
											</Menu>
										</div>
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
