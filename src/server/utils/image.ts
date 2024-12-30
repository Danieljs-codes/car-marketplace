import { serverOnly$ } from "vite-env-only/macros";
import { encode } from "blurhash";
import sharp from "sharp";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
export const generateBlurhash = serverOnly$(
	async (buffer: Buffer): Promise<string> => {
		const { data, info } = await sharp(buffer)
			.raw()
			.ensureAlpha()
			.resize(32, 32, { fit: "inside" })
			.toBuffer({ resolveWithObject: true });

		const hash = encode(
			new Uint8ClampedArray(data),
			info.width,
			info.height,
			4,
			4,
		);

		return hash;
	},
)!;

// biome-ignore lint/style/noNonNullAssertion: <explanation>
export const processImage = serverOnly$(async (file: File) => {
	const buffer = Buffer.from(await file.arrayBuffer());
	const blurhash = await generateBlurhash(buffer);

	// Optimize image
	const optimizedBuffer = await sharp(buffer)
		.resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
		.jpeg({ quality: 80 })
		.toBuffer();

	return {
		buffer: optimizedBuffer,
		blurhash,
		size: optimizedBuffer.length,
		name: file.name,
		type: file.type,
	};
})!;
