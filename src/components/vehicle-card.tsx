import { IconHeart, IconMap } from "justd-icons";
import { Button } from "./ui/button";
import { formatCurrency } from "~/utils/misc";

type VehicleCardProps = {
	title: string;
	price: number;
	mileage: string;
	location: string;
	image: string;
	year: number;
};

const VehicleCard = ({
	title,
	price,
	mileage,
	location,
	image,
	year,
}: VehicleCardProps) => {
	return (
		<div className="bg-card rounded-lg overflow-hidden border border-border">
			<div className="relative aspect-[16/9] isolate">
				<img src={image} alt={title} className="object-cover w-full h-full" />
				<Button
					size="square-petite"
					className="absolute top-2 right-2"
					appearance="solid"
					intent="secondary"
				>
					<IconHeart />
				</Button>
			</div>
			<div className="p-4">
				<h3 className="font-semibold text-lg mb-2">{title}</h3>
				<div className="flex items-center gap-2 text-muted-fg text-sm mb-2">
					<span>{year}</span>
					<span>•</span>
					<span>{mileage}</span>
				</div>
				<div className="flex items-center gap-1 text-sm text-muted-fg mb-3">
					<IconMap className="w-4 h-4" />
					<span>{location}</span>
				</div>
				<div className="font-semibold text-xl">
					{formatCurrency({ amount: price })}
				</div>
			</div>
		</div>
	);
};

export { VehicleCard };
