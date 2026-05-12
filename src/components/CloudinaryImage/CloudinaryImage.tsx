import { Cloudinary } from "@cloudinary/url-gen";
import "./CloudinaryImage.css";

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
} as const;

type CloudinaryImageProps = {
	folderName: keyof typeof folderNames;
	fileName: string;
	className?: string;
};

const normalize = (value: string) =>
	value.replaceAll(" ", "_").replaceAll("&", "_");

export const CloudinaryImage = ({
	folderName,
	fileName,
	className,
}: CloudinaryImageProps) => {
	const publicId = `${folderNames[folderName]}/${normalize(fileName)}`;

	const image = cld.image(publicId);

	return (
		<img
			src={image.toURL()}
			className={className}
		/>
	);
};
