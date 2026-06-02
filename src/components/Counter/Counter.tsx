import "./Counter.css";

import { MdErrorOutline, MdOutlineAddCircleOutline } from "react-icons/md";
import { FaRegCircleCheck } from "react-icons/fa6";

type CounterProps = {
	current: number;
	max: number;
	label: string;
	onClick?: () => void;
};

export const Counter = ({ current, max, label, onClick }: CounterProps) => {
	const percent = (current / max) * 100;
	const icon =
		current > max ? (
			<MdErrorOutline size={20} />
		) : current === max ? (
			<FaRegCircleCheck size={17} />
		) : (
			<MdOutlineAddCircleOutline size={20} />
		);
	return (
		<div
			className={`prospect-counter ${onClick ? "clickable" : ""}`}
			onClick={onClick}
		>
			<div className="prospect-counter-header">
				<span>{label}</span>
				<span>
					{current}/{max}
				</span>
			</div>

			<div className="prospect-counter-bar-container">
				<div className="prospect-counter-bar">
					<div
						className={`prospect-counter-fill ${
							current > max ? "over-limit" : ""
						}`}
						style={{ width: `${percent}%` }}
					/>
				</div>
				<div
					className={`prospect-counter-icon ${current > max ? "over-limit" : ""}`}
				>
					{icon}
				</div>
			</div>
		</div>
	);
};
