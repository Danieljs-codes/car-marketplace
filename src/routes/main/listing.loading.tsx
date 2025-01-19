import { Link } from "@tanstack/react-router";
import { IconChevronLeft } from "justd-icons";
import { Fragment } from "react/jsx-runtime";
import { buttonStyles, Card, DescriptionList, Separator } from "ui";
import { Skeleton } from "~/components/ui/skeleton";

export function ListingLoading() {
	return (
		<div className="max-w-screen-xl mx-auto px-4 py-10">
			<div className="mb-4">
				<Link
					to="/browse-cars"
					className={buttonStyles({
						appearance: "outline",
						size: "extra-small",
					})}
				>
					<IconChevronLeft />
					Back
				</Link>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
				<div>
					<Card className="h-[300px] md:h-[500px]">
						<Skeleton className="w-full h-full" />
					</Card>
				</div>
				<div>
					<div>
						<Skeleton className="h-8 w-3/4 mb-2" />
						<Skeleton className="h-8 w-1/3" />
					</div>
					<div>
						<DescriptionList className="mt-6">
							{Array.from({ length: 7 }).map((_, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<Fragment key={index}>
									<DescriptionList.Term>
										<Skeleton className="h-4 w-20" />
									</DescriptionList.Term>
									<DescriptionList.Details>
										<Skeleton className="h-4 w-32" />
									</DescriptionList.Details>
								</Fragment>
							))}
						</DescriptionList>
						<div className="mt-6 flex flex-col md:flex-row gap-4">
							<Skeleton className="h-10 w-full flex-1" />
							<Skeleton className="h-10 w-full flex-1" />
						</div>
					</div>
				</div>
			</div>
			<Separator className="mt-4 md:hidden" />
			<div className="mt-4 md:mt-8">
				<Skeleton className="h-6 w-32 mb-2" />
				<Skeleton className="h-24 w-full" />
			</div>
			<Separator className="my-4" />
			<div className="mt-4">
				<Skeleton className="h-6 w-40 mb-2" />
				<Card className="px-4">
					<DescriptionList>
						{Array.from({ length: 3 }).map((_, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<Fragment key={index}>
								<DescriptionList.Term>
									<Skeleton className="h-4 w-24" />
								</DescriptionList.Term>
								<DescriptionList.Details>
									<Skeleton className="h-4 w-48" />
								</DescriptionList.Details>
							</Fragment>
						))}
					</DescriptionList>
				</Card>
			</div>
		</div>
	);
}
