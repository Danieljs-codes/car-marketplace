import { Select } from "ui";
import { Button } from "./ui/button";

const Hero = () => {
	return (
		<div className="py-20">
			<div className="text-center">
				<h1 className="text-5xl md:text-6xl font-bold mb-2 leading-tight text-white">
					Discover Your Dream Ride
				</h1>
				<p className="text-xl mb-6 text-muted-fg">
					Explore thousands of quality vehicles at unbeatable prices
				</p>
			</div>
			<div className="flex items-center gap-4 max-w-4xl mx-auto">
				<Select placeholder="Select brand">
					<Select.Trigger />
					<Select.List>
						<Select.Option>Toyota</Select.Option>
						<Select.Option>Honda</Select.Option>
						<Select.Option>BMW</Select.Option>
					</Select.List>
				</Select>
				<Select placeholder="Select model">
					<Select.Trigger />
					<Select.List>
						<Select.Option>Camry</Select.Option>
						<Select.Option>Corolla</Select.Option>
						<Select.Option>RAV4</Select.Option>
					</Select.List>
				</Select>
				<Select placeholder="Select year">
					<Select.Trigger />
					<Select.List>
						<Select.Option>2024</Select.Option>
						<Select.Option>2023</Select.Option>
						<Select.Option>2022</Select.Option>
					</Select.List>
				</Select>
				<Button size="medium">Search</Button>
			</div>
		</div>
	);
};

export { Hero };
