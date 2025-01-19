import { Button, Card, Heading, SearchField, Table } from "ui";
import { IconChevronLeft, IconChevronRight } from "justd-icons";
import { Skeleton } from "~/components/ui/skeleton";

export function OrdersLoading() {
	return (
		<div>
			<Heading className="mb-8">Orders</Heading>
			<div className="mb-4 flex items-center justify-center gap-4">
				<SearchField isDisabled value="" className="flex-1" />
				<Button isDisabled type="submit">
					Search
				</Button>
			</div>
			<Card>
				<Table aria-label="Orders loading">
					<Table.Header>
						<Table.Column isRowHeader>Vehicle</Table.Column>
						<Table.Column>Buyer Name</Table.Column>
						<Table.Column>Buyer Email</Table.Column>
						<Table.Column>Amount</Table.Column>
						<Table.Column>Platform Fee</Table.Column>
						<Table.Column>Net Amount</Table.Column>
						<Table.Column>Status</Table.Column>
						<Table.Column>Date</Table.Column>
					</Table.Header>
					<Table.Body>
						{Array.from({ length: 10 }).map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<Table.Row key={i}>
								<Table.Cell>
									<Skeleton className="h-4 w-32" />
								</Table.Cell>
								<Table.Cell>
									<Skeleton className="h-4 w-24" />
								</Table.Cell>
								<Table.Cell>
									<Skeleton className="h-4 w-40" />
								</Table.Cell>
								<Table.Cell>
									<Skeleton className="h-4 w-20" />
								</Table.Cell>
								<Table.Cell>
									<Skeleton className="h-4 w-20" />
								</Table.Cell>
								<Table.Cell>
									<Skeleton className="h-4 w-20" />
								</Table.Cell>
								<Table.Cell>
									<Skeleton className="h-6 w-16" shape="square" />
								</Table.Cell>
								<Table.Cell>
									<Skeleton className="h-4 w-28" />
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
				<p className="text-sm text-muted-fg">
					<Skeleton className="h-4 w-24 inline-block" />
				</p>
				<Button size="extra-small" appearance="outline" isDisabled>
					Next
					<IconChevronRight />
				</Button>
			</div>
		</div>
	);
}
