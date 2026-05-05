import "./LoadingSpinner.css";

type LoadingSpinnerProps = {
	size?: number;
	color?: string;
};

export const LoadingSpinner = ({ size = 40, color }: LoadingSpinnerProps) => {
	return (
		<div
			className="loading-spinner"
			style={{
				width: size,
				height: size,
				borderTopColor: color ?? undefined,
			}}
		/>
	);
};
