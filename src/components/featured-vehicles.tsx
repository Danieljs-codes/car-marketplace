import { Link } from "@tanstack/react-router";
import { VehicleCard } from "./vehicle-card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getHomePageCarListingsQueryOptions } from "~/utils/query-options";

const FeaturedVehicles = () => {
	const { data } = useSuspenseQuery(getHomePageCarListingsQueryOptions());

	return (
		<section className="pb-16 max-w-screen-xl mx-auto px-4">
			<div className="container">
				<h2 className="text-3xl font-bold mb-8">Featured Vehicles</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{data.map((vehicle) => (
						<Link
							key={vehicle.id}
							to="/listings/$listingId"
							params={{ listingId: vehicle.id }}
						>
							<VehicleCard
								image={vehicle.images[0].url}
								title={`${vehicle.make} ${vehicle.model}`}
								price={vehicle.price / 100}
								location={vehicle.location}
								year={vehicle.year}
								mileage={vehicle.mileage}
								transmission={vehicle.transmission}
								hash={vehicle.images[0].blurhash}
							/>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
};

export { FeaturedVehicles };
