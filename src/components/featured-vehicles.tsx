import { VehicleCard } from "./vehicle-card";

const DEMO_VEHICLES = [
	{
		id: "1",
		title: "2023 Toyota Camry XLE",
		price: 32000000,
		mileage: "12,000 km",
		location: "Lagos, Nigeria",
		image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
		year: 2023,
	},
	{
		id: "2",
		title: "2022 Honda Accord Sport",
		price: 28000000,
		mileage: "15,000 km",
		location: "Abuja, Nigeria",
		image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800",
		year: 2022,
	},
	{
		id: "3",
		title: "2024 BMW 3 Series",
		price: 45000000,
		mileage: "5,000 km",
		location: "Port Harcourt, Nigeria",
		image: "https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?w=800",
		year: 2024,
	},
	{
		id: "4",
		title: "2023 Mercedes-Benz C-Class",
		price: 52000000,
		mileage: "8,000 km",
		location: "Lagos, Nigeria",
		image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
		year: 2023,
	},
	{
		id: "5",
		title: "2022 Lexus ES 350",
		price: 38000000,
		mileage: "20,000 km",
		location: "Abuja, Nigeria",
		image: "https://images.unsplash.com/photo-1615106806531-183c31fccfdc?w=800",
		year: 2022,
	},
	{
		id: "6",
		title: "2024 Audi A4",
		price: 48000000,
		mileage: "3,000 km",
		location: "Lagos, Nigeria",
		image: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800",
		year: 2024,
	},
	{
		id: "7",
		title: "2023 Range Rover Sport",
		price: 75000000,
		mileage: "10,000 km",
		location: "Port Harcourt, Nigeria",
		image: "https://images.unsplash.com/photo-1606220838315-056192d5e927?w=800",
		year: 2023,
	},
	{
		id: "8",
		title: "2022 Porsche Cayenne",
		price: 82000000,
		mileage: "15,000 km",
		location: "Lagos, Nigeria",
		image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
		year: 2022,
	},
];

const FeaturedVehicles = () => {
	return (
		<section className="pb-16 max-w-screen-xl mx-auto px-4">
			<div className="container">
				<h2 className="text-3xl font-bold mb-8">Featured Vehicles</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{DEMO_VEHICLES.map((vehicle) => (
						<VehicleCard key={vehicle.id} {...vehicle} />
					))}
				</div>
			</div>
		</section>
	);
};

export { FeaturedVehicles };
