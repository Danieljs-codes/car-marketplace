import { Link } from "@tanstack/react-router";
import { Card, Carousel } from "ui";

const categories = [
	{
		id: 1,
		name: "sedan",
		image:
			"https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&w=800&q=80",
	},
	{
		id: 2,
		name: "coupe",
		image:
			"https://images.unsplash.com/photo-1722626238711-aebd45e8a088?auto=format&w=800&q=80",
	},
	{
		id: 3,
		name: "suv",
		image:
			"https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&w=800&q=80",
	},
	{
		id: 4,
		name: "crossover",
		image:
			"https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&w=800&q=80",
	},
	{
		id: 5,
		name: "wagon/hatchback",
		image:
			"https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&w=800&q=80",
	},
	{
		id: 6,
		name: "green car/hybrid",
		image:
			"https://images.unsplash.com/photo-1585011664466-b7bbe92f34ef?auto=format&w=800&q=80",
	},
	{
		id: 7,
		name: "convertible",
		image:
			"https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?auto=format&w=800&q=80",
	},
	{
		id: 8,
		name: "sports car",
		image:
			"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&w=800&q=80",
	},
	{
		id: 9,
		name: "pickup truck",
		image:
			"https://images.unsplash.com/photo-1649793395985-967862a3b73f?auto=format&w=800&q=80",
	},
	{
		id: 10,
		name: "minivan/van",
		image:
			"https://images.unsplash.com/photo-1617503186332-bbe15682ba11?auto=format&w=800&q=80",
	},
	{
		id: 11,
		name: "luxury car",
		image:
			"https://images.unsplash.com/photo-1563720360172-67b8f3dce741?auto=format&w=800&q=80",
	},
] as const;

export const CategoryCarousel = () => {
	return (
		<div className="max-w-screen-xl mx-auto px-4 pb-16">
			<div className="container">
				<h2 className="text-3xl font-bold mb-8">Popular Categories</h2>
			</div>
			<Carousel
				opts={{
					align: "center",
					loop: true,
				}}
				className="w-full"
			>
				<Carousel.Content items={categories}>
					{({ id, name, image }) => (
						<Carousel.Item id={id} className="basis-1/2 lg:basis-1/5">
							<Link
								rel="stylesheet"
								to="/browse-cars"
								search={(prev) => ({ ...prev, category: name })}
							>
								<Card className="flex aspect-square items-center justify-center overflow-hidden relative">
									<img
										src={image}
										alt={name}
										className="absolute inset-0 w-full h-full object-cover"
									/>
									<div className="absolute inset-0 bg-black/40 flex items-end p-4">
										<Card.Title className="text-white capitalize">
											{name}
										</Card.Title>
									</div>
								</Card>
							</Link>
						</Carousel.Item>
					)}
				</Carousel.Content>
				<Carousel.Handler>
					<Carousel.Button slot="previous" />
					<Carousel.Button slot="next" />
				</Carousel.Handler>
			</Carousel>
		</div>
	);
};
