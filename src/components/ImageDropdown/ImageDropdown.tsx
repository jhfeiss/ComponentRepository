import { useEffect, useRef, useState } from "react";
import "./ImageDropdown.css";
import { CloudinaryImage } from "../..";

type Props = {
	options: any[];
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	label?: string;
};

export const ImageDropdown = ({
	options,
	value,
	label,
	onChange,
	placeholder = "Select...",
}: Props) => {
	const [open, setOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);

	const selected = options.find((o) => o.value === value);

	// close on outside click
	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", onClick);
		return () => document.removeEventListener("mousedown", onClick);
	}, []);

	let imageName = selected?.image
		? selected.image.replace("HelmetFlag_", "")
		: "default_image";

	if (
		imageName.includes("DELETE_FROM_JSON") ||
		imageName.toLowerCase().includes("none")
	) {
		imageName = "default_image";
	}

	return (
		<div className="ui-input-wrapper">
			{label && <label className="ui-input-label">{label}</label>}
			<div
				className="ui-image-dropdown"
				ref={rootRef}
			>
				{/* trigger */}
				<div
					className="ui-image-dropdown-trigger"
					onClick={() => setOpen((p) => !p)}
				>
					<CloudinaryImage
						folderName="CharacterVisuals"
						fileName={imageName}
						className="ui-image-dropdown-image"
					/>

					<span>{selected?.key ?? placeholder}</span>

					<span className="ui-image-dropdown-arrow">▾</span>
				</div>

				{/* menu */}
				{open && (
					<div className="ui-image-dropdown-menu">
						{options.map((opt) => {
							let itemImageName = opt.image
								? opt.image.replace("HelmetFlag_", "")
								: "default_image";

							if (
								itemImageName.includes("DELETE_FROM_JSON") ||
								itemImageName.toLowerCase().includes("none")
							) {
								itemImageName = "default_image";
							}
							return (
								<div
									key={opt.value}
									className={`ui-image-dropdown-item ${
										opt.value === value ? "active" : ""
									}`}
									onClick={() => {
										onChange(opt.value);
										setOpen(false);
									}}
								>
									{opt.image && (
										<CloudinaryImage
											folderName="CharacterVisuals"
											fileName={itemImageName}
											className="ui-image-dropdown-image"
										/>
									)}
									<span>{opt.key}</span>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};
