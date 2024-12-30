import { utapi } from "~server/uploadthing";

export async function uploadToStorage({
	file,
	key,
	contentType,
}: {
	file: File;
	key: string;
	contentType: string;
}) {
	const result = await utapi.uploadFiles(file);

	if (!result?.data) {
		throw new Error("Failed to upload file");
	}

	return {
		key: result.data.key,
		url: result.data.url,
		name: result.data.name,
	};
}
