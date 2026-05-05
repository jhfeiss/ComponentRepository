import "./Input.css";

type InputProps = {
	value?: string;
	defaultValue?: string;
	placeholder?: string;
	label?: string;
	error?: string;
	disabled?: boolean;
	onChange?: (value: string) => void;

	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
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
}: InputProps) => {
	return (
		<div className="ui-input-wrapper">
			{label && <label className="ui-input-label">{label}</label>}

			<div className={`ui-input-container ${error ? "error" : ""}`}>
				{leftIcon && <div className="ui-input-icon left">{leftIcon}</div>}
				<input
					className="ui-input"
					value={value}
					defaultValue={defaultValue}
					placeholder={placeholder}
					disabled={disabled}
					onChange={(e) => onChange?.(e.target.value)}
				/>
				{rightIcon && <div className="ui-input-icon right">{rightIcon}</div>}
			</div>

			{error && <div className="ui-input-error">{error}</div>}
		</div>
	);
};
