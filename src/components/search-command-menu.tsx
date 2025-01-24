import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CommandMenu } from "ui";
import { $searchCarListings } from "~/server/actions/listings";
import { CommandMenuImage } from "./command-menu-image";
import { useNavigate } from "@tanstack/react-router";

interface SearchCommandMenuProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

const car = {
	id: "uj3t7eq6rzagm2gpf5ekf4nm",
	make: "Aston Martin",
	model: "DBX707",
	year: 2024,
	condition: "new",
	price: 165000000,
	mileage: "0",
	transmission: "automatic",
	fuelType: "petrol",
	description: null,
	category: "suv",
	status: "active",
	images: [
		{
			key: "dqWUSZlN3MnPiYYd1jYouOjrt1wMnS5Wezhc6NyQEZ8m2YXH",
			url: "https://utfs.io/f/dqWUSZlN3MnPiYYd1jYouOjrt1wMnS5Wezhc6NyQEZ8m2YXH",
			name: "image-1737688211850.jpg",
			size: 2444615,
			blurhash: "UDBN7r%OD%k94mRPt8xt8wIAtRWA.A%NM_M|",
		},
		{
			key: "dqWUSZlN3MnPNrmtiGgODhEormHYkVJwIuq2cv4dXLzfyGR9",
			url: "https://utfs.io/f/dqWUSZlN3MnPNrmtiGgODhEormHYkVJwIuq2cv4dXLzfyGR9",
			name: "image-1737688209145.jpg",
			size: 2437356,
			blurhash: "UiFFpgIUM{WB~qM{RjWBtRRit7WBIAWBt7WV",
		},
		{
			key: "dqWUSZlN3MnPILcm8UJqEOigpRrYZjJGPx9m5Wuavn2BwMSH",
			url: "https://utfs.io/f/dqWUSZlN3MnPILcm8UJqEOigpRrYZjJGPx9m5Wuavn2BwMSH",
			name: "image-1737688211877.jpg",
			size: 3999706,
			blurhash: "U-KUD+ofRjt7~WofRjj[ofj@V@ayxuofaet7",
		},
		{
			key: "dqWUSZlN3MnPJdl1KlZDP15rD3tgkaMTmzAOcvWGyZVNLxi7",
			url: "https://utfs.io/f/dqWUSZlN3MnPJdl1KlZDP15rD3tgkaMTmzAOcvWGyZVNLxi7",
			name: "image-1737688212543.jpg",
			size: 2547305,
			blurhash: "UB7.s,EyEL?HuhW.WBxaVYjZofWBx]bHRjof",
		},
	],
	location: "Abuja, Nigeria",
	vin: "5FNRL5H49BB123456",
	createdAt: "2025-01-24T03:10:32.307Z",
	seller: {
		id: "l7lqz5pe4y28r5kbmwz8a7w8",
		businessName: "Amen Thomp",
		businessEmail: "amenthopson@gmail.com",
		businessPhoneNumber: "09053462658",
	},
	isFavorite: false,
};

export const SearchCommandMenu = ({
	isOpen,
	onOpenChange,
}: SearchCommandMenuProps) => {
	const navigate = useNavigate({ from: "/" });
	const [searchQuery, setSearchQuery] = useState("");
	const { data, isFetching, error } = useQuery({
		queryKey: ["searchCar", searchQuery],
		queryFn: async () => {
			const response = await $searchCarListings({
				data: {
					query: searchQuery.toLowerCase().trim(),
				},
			});

			return response;
		},
		enabled: searchQuery.length > 0,
	});

	return (
		<CommandMenu
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			isPending={isFetching}
			shortcut="/"
			inputValue={searchQuery}
			onInputChange={setSearchQuery}
			isBlurred
		>
			<CommandMenu.Search placeholder="Search for products" />
			<CommandMenu.List className="scrollbar-hidden" items={data}>
				{(car) => (
					<CommandMenu.Item
						key={car.id}
						textValue={`${car.make} ${car.model} ${car.year}`}
						onAction={() => {
							onOpenChange(false);
							setSearchQuery("");
							navigate({
								to: "/listings/$listingId",
								params: { listingId: car.id },
							});
						}}
					>
						<CommandMenuImage
							alt={`${car.make} ${car.model} ${car.year}`}
							blurhash={car.images[0].blurhash}
							url={car.images[0].url}
						/>
						<CommandMenu.Label>{`${car.make} ${car.model} ${car.year}`}</CommandMenu.Label>
					</CommandMenu.Item>
				)}
			</CommandMenu.List>
		</CommandMenu>
	);
};
