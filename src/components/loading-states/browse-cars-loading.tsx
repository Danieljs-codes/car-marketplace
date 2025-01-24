import { Card } from "ui";
import { Skeleton } from "../ui/skeleton";

function CarCardSkeleton() {
	return (
		<Card className="h-full overflow-hidden">
			<Card.Content className="p-0">
				<Skeleton className="aspect-[4/3] rounded-t-lg rounded-b-none" />
				<div className="p-4">
					<Skeleton className="h-5 w-3/4 mb-2" />
					<Skeleton className="h-7 w-1/3 mb-4" />
					<div className="grid grid-cols-2 gap-2 mb-3">
						<Skeleton className="h-5 w-24" />
						<Skeleton className="h-5 w-24" />
					</div>
					<div className="flex gap-2">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-4" />
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-4" />
						<Skeleton className="h-4 w-16" />
					</div>
				</div>
			</Card.Content>
		</Card>
	);
}

export function BrowseCarsLoading() {
	return (
		<div className="py-10 max-w-screen-xl mx-auto px-4">
			<div className="flex justify-end">
				<Skeleton className="h-8 w-8 mb-4 md:hidden" />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-[256px_1fr] gap-4">
				<div className="hidden md:block">
					<Skeleton className="h-[500px] w-full rounded-xl" />
				</div>
				<div className="space-y-4">
					<Skeleton className="h-5 w-32" />
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{Array.from({ length: 6 }).map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<CarCardSkeleton key={i} />
						))}
					</div>
					<div className="flex justify-between gap-2 mt-4 md:mt-8">
						<Skeleton className="h-9 w-24" />
						<Skeleton className="h-9 w-24" />
					</div>
				</div>
			</div>
		</div>
	);
}
