import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, Button, buttonStyles, Card, Heading, Menu, Table } from "ui";
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
import {
	IconChevronLeft,
	IconChevronRight,
	IconDotsVertical,
	IconFolderDelete,
	IconPencilBox,
} from "justd-icons";

const listingsSearchSchema = z.object({
	page: fallback(z.number(), 1).default(1),
	pageSize: fallback(z.number(), 10).default(10),
});

export const Route = createFileRoute("/_seller-layout-id/listings/")({
	validateSearch: zodValidator(listingsSearchSchema),
	loaderDeps: ({ search: { page, pageSize } }) => ({ page, pageSize }),
	loader: async ({ context, deps: { page, pageSize } }) => {
		context.queryClient.ensureQueryData(
			getPaginatedListingsForSellerQueryOptions({ page, pageSize }),
		);

		return {
			crumb: "Listings",
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const {
		data: { listings, page, pageSize, totalCount, totalPages },
	} = useSuspenseQueryDeferred(
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
					to="/listings/new"
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
							items={listings}
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
										{formatCurrency({ amount: item.price })}
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
													<Menu.Item className="text-sm" isDanger>
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
						Page {page} of {Math.ceil(listings.length / pageSize)}
					</p>
					<Button
						size="extra-small"
						appearance="outline"
						isDisabled={page * pageSize >= listings.length}
						onPress={() => navigate({ search: { page: page + 1, pageSize } })}
					>
						Next
						<IconChevronRight />
					</Button>
				</div>
			</div>
		</div>
	);
}
