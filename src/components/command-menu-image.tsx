import { useState } from "react";
import { Blurhash } from "react-blurhash";

interface CommandMenuImageProps {
	url: string;
	blurhash: string;
	alt: string;
}

export const CommandMenuImage = ({
	url,
	blurhash,
	alt,
}: CommandMenuImageProps) => {
	const [isVisible, setIsVisible] = useState(false);
	return (
		<div className="relative h-5 w-5 mr-2">
			<img
				src={url}
				alt={alt}
				className="absolute size-5 rounded-[2px]"
				onLoad={() => setIsVisible(true)}
				style={{ opacity: isVisible ? 1 : 0 }}
			/>
			<Blurhash
				style={{
					position: "absolute",
					height: "20px",
					width: "20px",
					borderRadius: "2px",
					overflow: "hidden",
					opacity: isVisible ? 0 : 1,
				}}
				hash={blurhash}
			/>
		</div>
	);
};
