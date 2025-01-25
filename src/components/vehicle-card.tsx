import { IconHeart, IconMap } from "justd-icons";
import { Button } from "./ui/button";
import { formatCurrency } from "~/utils/misc";
import { FeaturedVehicleImage } from "./featured-vehicle-image";

type VehicleCardProps = {
	title: string;
	price: number;
	mileage: string;
	location: string;
	image: string;
	year: number;
	transmission: "automatic" | "manual";
	hash: string;
};

const VehicleCard = ({
	title,
	price,
	mileage,
	location,
	image,
	year,
	transmission,
	hash,
}: VehicleCardProps) => {
	return (
		<div className="bg-card rounded-lg overflow-hidden border border-border">
			<div className="relative aspect-[16/9] isolate">
				<FeaturedVehicleImage image={image} alt={title} hash={hash} />
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
				<h3 className="font-semibold text-lg mb-2 truncate">{title}</h3>
				<div className="flex items-center gap-2 text-muted-fg text-sm mb-2">
					<span>{year}</span>
					<span>•</span>
					<span>{`${mileage}km`}</span>
					<span>•</span>
					<span>{transmission}</span>
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
