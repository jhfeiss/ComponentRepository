import { useEffect, useRef, useState } from "react";
import "./ImageDropdown.css";
import { CloudinaryImage } from "../..";

type Props = {
	options: any[];
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
};

export const ImageDropdown = ({
	options,
	value,
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

	return (
		<div
			className="ui-dropdown"
			ref={rootRef}
		>
			{/* trigger */}
			<div
				className="ui-dropdown-trigger"
				onClick={() => setOpen((p) => !p)}
			>
				{selected?.image && (
					<CloudinaryImage
						folderName="CharacterVisuals"
						fileName={selected.image}
						className="ui-dropdown-image"
					/>
				)}

				<span>{selected?.key ?? placeholder}</span>

				<span className="ui-dropdown-arrow">▾</span>
			</div>

			{/* menu */}
			{open && (
				<div className="ui-dropdown-menu">
					{options.map((opt) => (
						<div
							key={opt.value}
							className={`ui-dropdown-item ${
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
									fileName={opt.image}
									className="ui-dropdown-image"
								/>
							)}
							<span>{opt.key}</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
