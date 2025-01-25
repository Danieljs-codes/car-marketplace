import { useState } from "react";
import { Blurhash } from "react-blurhash";

export const FeaturedVehicleImage = ({
	image,
	alt,
	hash,
}: { image: string; alt: string; hash: string }) => {
	const [isVisible, setIsVisible] = useState(false);
	return (
		<div className="relative size-full aspect-[16/9]">
			<img
				src={image}
				alt={alt}
				className="object-cover size-full absolute inset-0"
				onLoad={() => setIsVisible(true)}
			/>
			<Blurhash
				hash={hash}
				style={{
					width: "100%",
					height: "100%",
					opacity: isVisible ? 0 : 1,
					display: isVisible ? "none" : "block",
				}}
			/>
		</div>
	);
};
