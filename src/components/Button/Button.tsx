import "./Button.css";

type ButtonProps = {
	children: React.ReactNode;
	variant?: "primary" | "secondary" | "ghost";
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
	onClick?: () => void;
};

export const Button = ({
	children,
	variant = "primary",
	size = "md",
	disabled = false,
	onClick,
}: ButtonProps) => {
	return (
		<button
			className={`ui-button ${variant} ${size}`}
			disabled={disabled}
			onClick={onClick}
		>
			{children}
		</button>
	);
};
