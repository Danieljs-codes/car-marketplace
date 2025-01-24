import { processImage } from "./image";
import { uploadToStorage } from "./storage";

async function downloadImage(url: string): Promise<File> {
	const response = await fetch(url);
	const buffer = await response.arrayBuffer();
	const type = response.headers.get("content-type") || "image/jpeg";
	return new File([buffer], `image-${Date.now()}.jpg`, { type });
}

export async function processAndUploadImage(imageUrl: string) {
	const imageFile = await downloadImage(imageUrl);
	const processed = await processImage(imageFile);

	const uploadResult = await uploadToStorage({
		file: imageFile,
	});

	return {
		...uploadResult,
		blurhash: processed.blurhash,
		size: imageFile.size,
	};
}
