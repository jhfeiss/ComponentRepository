import "./TopBar.css";

export type TopBarItem = {
	label: string;
	onClick: () => void;
	active?: boolean;
};

export type TopBarProps = {
	left?: React.ReactNode;
	right?: React.ReactNode;
	items?: TopBarItem[];
};

export const TopBar = ({ left, right, items }: TopBarProps) => {
	return (
		<div className="ui-topbar">
			{/* LEFT */}
			<div className="ui-topbar-left ui-topbar-drag-area">{left}</div>

			{/* CENTER NAV */}
			<div className="ui-topbar-center">
				{items?.map((item, i) => (
					<div
						key={i}
						className={`ui-topbar-item ${item.active ? "active" : ""}`}
						onClick={item.onClick}
					>
						{item.label}
					</div>
				))}
			</div>

			{/* RIGHT */}
			<div className="ui-topbar-right">{right}</div>
		</div>
	);
};
