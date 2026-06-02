import { useEffect, useRef, useState } from "react";
import "./Dropdown.css";
import { FaSearch } from "react-icons/fa";

import { CloudinaryImage } from "../CloudinaryImage";

type DropdownProps = {
	options: DropdownOption[];
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	label?: string;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	defaultImage?: string;
	imageFolder?:
		| "CollegeLogos"
		| "NflLogos"
		| "MaddenPoraits"
		| "DevTraits"
		| "AppLogos"
		| "CharacterVisuals";
	width?: number;
};

type DropdownOption = {
	label: string;
	labelShort?: string;
	value: string;
	image?: string;
};

export const Dropdown = ({
	options,
	value,
	onChange,
	placeholder = "Select...",
	label,
	leftIcon,
	rightIcon,
	imageFolder,
	defaultImage = "default",
	width,
}: DropdownProps) => {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const selected = options.find((o) => o.value == value);
	const rootRef = useRef<HTMLDivElement>(null);

	const filteredOptions = options.filter((opt) =>
		opt.label.toLowerCase().includes(search.toLowerCase()),
	);
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
			style={{ width: width ? `${width}px` : "" }}
		>
			{label && <div className="ui-dropdown-label">{label}</div>}

			<div
				className={`ui-dropdown-control ${open ? "open" : ""}`}
				onClick={() => {
					setOpen((v) => {
						if (!v) setSearch("");
						return !v;
					});
				}}
			>
				{leftIcon && <div className="ui-input-icon left">{leftIcon}</div>}
				<div className={"ui-dropdown-inner-wrapper"}>
					<div className="ui-dropdown-inner-wrapper-image-label">
						{selected && selected.image && imageFolder && (
							<CloudinaryImage
								folderName={imageFolder}
								fileName={selected.image}
								className="ui-dropdown-image"
								defaultImage={defaultImage}
							/>
						)}
						{selected
							? selected.labelShort
								? selected.labelShort
								: selected.label
							: placeholder}
					</div>
					{rightIcon && (
						<div className={`ui-input-icon right ${open ? "open" : ""}`}>
							{rightIcon}
						</div>
					)}
				</div>
			</div>

			{open && (
				<div
					className="ui-dropdown-menu"
					ref={rootRef}
				>
					<div className="ui-dropdown-search-wrapper">
						<FaSearch className="ui-dropdown-search-icon" />
						<input
							type="text"
							className="ui-dropdown-search"
							placeholder="Search..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							onClick={(e) => e.stopPropagation()}
						/>
					</div>
					{filteredOptions.map((opt) => (
						<div
							key={opt.value}
							className="ui-dropdown-item"
							onClick={() => {
								onChange(opt.value);
								setOpen(false);
							}}
						>
							{opt.image && imageFolder && (
								<CloudinaryImage
									folderName={imageFolder}
									fileName={opt.image}
									className="ui-dropdown-image"
									defaultImage={defaultImage}
								/>
							)}
							{opt.label}
						</div>
					))}
					{filteredOptions.length === 0 && (
						<div className="ui-dropdown-empty">No results found</div>
					)}
				</div>
			)}
		</div>
	);
};
