import { Cloudinary } from "@cloudinary/url-gen";
import "./CloudinaryImage.css";
import { useEffect, useState } from "react";
import { defaultImage } from "@cloudinary/url-gen/actions/delivery";

const cld = new Cloudinary({
	cloud: {
		cloudName: "dujozdvy5",
	},
});

const folderNames = {
	CollegeLogos: "v1778449933",
	NflLogos: "v1778449814",
	MaddenPoraits: "v1778451475",
	DevTraits: "v1778541757",
	AppLogos: "v1779560764",
	CharacterVisuals: "v1779574244",
} as const;

type CloudinaryImageProps = {
	folderName: keyof typeof folderNames;
	fileName: string;
	className?: string;
	defaultImage?: string;
};

const normalize = (value: string) =>
	value ? value.replaceAll(" ", "_").replaceAll("&", "_") : "";

export const CloudinaryImage = ({
	folderName,
	fileName,
	className,
	defaultImage = "default",
}: CloudinaryImageProps) => {
	const publicId = `${folderNames[folderName]}/${normalize(fileName)}`;

	const image = cld.image(publicId);
	const [src, setSrc] = useState(image.toURL());
	useEffect(() => {
		setSrc(cld.image(publicId).toURL());
	}, [publicId]);

	return (
		<img
			src={src}
			onError={() => {
				setSrc(cld.image(`${folderNames[folderName]}/${defaultImage}`).toURL());
			}}
			className={className}
		/>
	);
};
