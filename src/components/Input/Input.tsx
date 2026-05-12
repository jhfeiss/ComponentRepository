import { clamp } from "../../utils/clamp";
import "./Input.css";

type InputProps = {
	value?: string;
	defaultValue?: string;
	placeholder?: string;
	label?: string;
	error?: string;
	disabled?: boolean;
	onChange?: (value: string | number) => void;

	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;

	type?: "text" | "number";

	minValue?: number;
	maxValue?: number;
};

export const Input = ({
	value,
	defaultValue,
	placeholder,
	label,
	error,
	disabled,
	onChange,
	leftIcon,
	rightIcon,
	type,
	minValue = 0,
	maxValue = 99,
}: InputProps) => {
	return (
		<div className="ui-input-wrapper">
			{label && <label className="ui-input-label">{label}</label>}

			<div className={`ui-input-container ${error ? "error" : ""}`}>
				{leftIcon && <div className="ui-input-icon left">{leftIcon}</div>}
				<input
					type={type}
					min={type === "number" ? minValue : undefined}
					max={type === "number" ? maxValue : undefined}
					className="ui-input"
					value={value}
					defaultValue={defaultValue}
					placeholder={placeholder}
					disabled={disabled}
					onChange={(e) => {
						const val = e.target.value;
						onChange?.(
							type === "number" ? clamp(Number(val), minValue, maxValue) : val,
						);
					}}
				/>
				{rightIcon && <div className="ui-input-icon right">{rightIcon}</div>}
			</div>

			{error && <div className="ui-input-error">{error}</div>}
		</div>
	);
};
