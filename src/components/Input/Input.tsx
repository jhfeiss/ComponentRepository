import { useEffect, useRef } from "react";
import { clamp } from "../../utils/clamp";
import { IoCaretUp, IoCaretDown } from "react-icons/io5";
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
	const timeoutRef = useRef<number | null>(null);
	const valueRef = useRef(Number(value ?? 0));
	useEffect(() => {
		valueRef.current = Number(value ?? 0);
	}, [value]);

	const stopStepping = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	};

	const stepValue = (direction: number) => {
		const next = clamp(valueRef.current + direction, minValue, maxValue);

		valueRef.current = next;

		onChange?.(next);
	};

	const startStepping = (direction: number) => {
		stopStepping();

		const tick = () => {
			stepValue(direction);

			timeoutRef.current = window.setTimeout(tick, 60);
		};

		tick();
	};

	useEffect(() => {
		return () => stopStepping();
	}, []);

	const numericValue = Number(value ?? 0);
	const isMax = numericValue >= maxValue;
	const isMin = numericValue <= minValue;

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
				{type === "number" && (
					<div className="ui-input-stepper">
						<div
							className={`ui-input-stepper-button ${isMax ? "disabled" : ""}`}
							onPointerDown={() => startStepping(1)}
							onPointerUp={stopStepping}
							onPointerLeave={stopStepping}
						>
							<IoCaretUp />
						</div>
						<div
							className={`ui-input-stepper-button ${isMin ? "disabled" : ""}`}
							onPointerDown={() => startStepping(-1)}
							onPointerUp={stopStepping}
							onPointerLeave={stopStepping}
						>
							<IoCaretDown />
						</div>
					</div>
				)}
				{rightIcon && <div className="ui-input-icon right">{rightIcon}</div>}
			</div>

			{error && <div className="ui-input-error">{error}</div>}
		</div>
	);
};
