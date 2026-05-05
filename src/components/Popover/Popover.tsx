import { useState, useRef, useEffect } from "react";
import "./Popover.css";

export type PopoverProps = {
	trigger: React.ReactNode;
	children: React.ReactNode;
};

export const Popover = ({ trigger, children }: PopoverProps) => {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	// close on outside click
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	return (
		<div
			className="ui-popover"
			ref={ref}
		>
			<div
				className={`ui-popover-trigger ${open ? "open" : ""}`}
				onClick={() => setOpen(!open)}
			>
				{trigger}
			</div>

			{open && <div className="ui-popover-panel">{children}</div>}
		</div>
	);
};
