import schema from "~/server/db/schema";
import { db } from "../src/server/db";
import { processAndUploadImage } from "../src/server/utils/bulk-upload";

interface CarListing {
	make: string;
	model: string;
	year: number;
	price: number;
	condition: "new" | "used" | "certified-pre-owned" | "damaged";
	mileage: string;
	transmission: "automatic" | "manual";
	fuelType: "petrol" | "diesel" | "electric" | "hybrid";
	category:
		| "sedan"
		| "coupe"
		| "suv"
		| "crossover"
		| "wagon/hatchback"
		| "green car/hybrid"
		| "convertible"
		| "sports car"
		| "pickup truck"
		| "minivan/van"
		| "luxury car";
	location: string;
	status: "active" | "sold" | "expired";
	sellerId: string;
	images: string[];
}

const demoListings: CarListing[] = [
	{
		make: "Aston Martin",
		model: "DBX707",
		year: 2024,
		price: 16500000000, // 165 million naira in kobo
		condition: "new",
		mileage: "0",
		transmission: "automatic",
		fuelType: "petrol",
		category: "suv",
		location: "Abuja, Nigeria",
		status: "active",
		sellerId: "l7lqz5pe4y28r5kbmwz8a7w8",
		images: [
			"https://images.unsplash.com/photo-1469285994282-454ceb49e63c",
			"https://images.unsplash.com/photo-1591076366941-20154e816ce3",
			"https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e",
			"https://images.unsplash.com/photo-1642479950692-f9894104e741",
		],
		// DONE
	},
];
async function uploadSingleListing(listing: CarListing) {
	try {
		const processedImages = await Promise.all(
			listing.images.map((url) => processAndUploadImage(url)),
		);

		await db.insert(schema.carListings).values({
			...listing,
			images: processedImages,
		});

		return { success: true, make: listing.make, model: listing.model };
	} catch (error) {
		return {
			success: false,
			make: listing.make,
			model: listing.model,
			error: error.message,
		};
	}
}

async function uploadDemoListings() {
	console.log(`Starting upload of ${demoListings.length} listings...`);

	const results = await Promise.all(
		demoListings.map(async (listing) => {
			const result = await uploadSingleListing(listing);
			if (result.success) {
				console.log(`✅ Uploaded: ${result.make} ${result.model}`);
			} else {
				console.error(
					`❌ Failed to upload ${result.make} ${result.model}: ${result.error}`,
				);
			}
			return result;
		}),
	);

	const successful = results.filter((r) => r.success).length;
	const failed = results.filter((r) => !r.success).length;

	console.log(`\nUpload complete:`);
	console.log(`✅ Successfully uploaded: ${successful}`);
	console.log(`❌ Failed uploads: ${failed}`);
}

uploadDemoListings()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error("Fatal error:", error);
		process.exit(1);
	});
