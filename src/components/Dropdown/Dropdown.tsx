import { useState } from "react";
import "./Dropdown.css";

import "./Dropdown.css";

type DropdownProps = {
	options: DropdownOption[];
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	label?: string;
};

type DropdownOption = {
	label: string;
	value: string;
	image?: string;
};

export const Dropdown = ({
	options,
	value,
	onChange,
	placeholder = "Select...",
	label,
}: DropdownProps) => {
	const [open, setOpen] = useState(false);

	const selected = options.find((o) => o.value === value);

	return (
		<div className="ui-dropdown">
			{label && <div className="ui-dropdown-label">{label}</div>}

			<div
				className="ui-dropdown-control"
				onClick={() => setOpen((v) => !v)}
			>
				{selected ? selected.label : placeholder}
			</div>

			{open && (
				<div className="ui-dropdown-menu">
					{options.map((opt) => (
						<div
							key={opt.value}
							className="ui-dropdown-item"
							onClick={() => {
								onChange(opt.value);
								setOpen(false);
							}}
						>
							{opt.image && (
								<img
									src={opt.image}
									className="ui-dropdown-image"
								/>
							)}
							{opt.label}
						</div>
					))}
				</div>
			)}
		</div>
	);
};
