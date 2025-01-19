import { Button, buttonStyles, Card, Heading, Table } from "ui";
import { IconChevronLeft, IconChevronRight } from "justd-icons";
import { Link } from "@tanstack/react-router";
import { Skeleton } from "~/components/ui/skeleton";

export function ListingsLoading() {
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
					<Table aria-label="Listings loading state">
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
						<Table.Body>
							{Array.from({ length: 5 }).map((_, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<Table.Row key={i}>
									<Table.Cell>
										<Skeleton className="h-4 w-16" />
									</Table.Cell>
									<Table.Cell>
										<Skeleton className="h-4 w-24" />
									</Table.Cell>
									<Table.Cell>
										<Skeleton className="h-4 w-20" />
									</Table.Cell>
									<Table.Cell>
										<Skeleton className="h-4 w-20" />
									</Table.Cell>
									<Table.Cell>
										<Skeleton className="h-4 w-12" />
									</Table.Cell>
									<Table.Cell>
										<Skeleton className="h-5 w-16" />
									</Table.Cell>
									<Table.Cell>
										<Skeleton className="h-4 w-28" />
									</Table.Cell>
									<Table.Cell>
										<div className="flex justify-end ml-4 sm:ml-0">
											<Skeleton className="h-6 w-6" />
										</div>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
				</Card>
				<div className="flex items-center justify-between mt-4">
					<Button size="extra-small" appearance="outline" isDisabled>
						<IconChevronLeft />
						Previous
					</Button>
					<Skeleton className="h-4 w-32" />
					<Button size="extra-small" appearance="outline" isDisabled>
						Next
						<IconChevronRight />
					</Button>
				</div>
			</div>
		</div>
	);
}
