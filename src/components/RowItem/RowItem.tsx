import "./RowItem.css";

type RowItemColumn = {
	key: string;
	content: React.ReactNode;
	width?: number; // optional flex control
	align?: "left" | "center" | "right";
};

type RowItemProps = {
	columns: RowItemColumn[];
	onClick?: () => void;
	active?: boolean;
	rightContent?: React.ReactNode;
};

export const RowItem = ({
	columns,
	onClick,
	active,
	rightContent,
}: RowItemProps) => {
	return (
		<div
			className={`ui-row-item ${active ? "active" : ""}`}
			onClick={onClick}
		>
			{/* FLEX COLUMNS */}
			<div className="ui-row-item-columns">
				{columns.map((col) => (
					<div
						key={col.key}
						className="ui-row-item-column"
						style={{
							flex: col.width ? `0 0 ${col.width}px` : 1,
							textAlign: col.align ?? "left",
						}}
					>
						{col.content}
					</div>
				))}
			</div>

			{/* RIGHT SIDE (OVR, ACTIONS, ETC) */}
			{rightContent && <div className="ui-row-item-right">{rightContent}</div>}
		</div>
	);
};
