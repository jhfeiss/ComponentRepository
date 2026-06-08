import "./NotificationTimer.css";

type TimerProps = {
	duration: number;
	size?: number;
	stroke?: number;
};

export const NotificationTimer = ({
	duration,
	size = 28,
	stroke = 3,
}: TimerProps) => {
	const radius = (size - stroke) / 2;
	const circumference = 2 * Math.PI * radius;

	return (
		<svg
			width={size}
			height={size}
			className="notification-timer"
		>
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				fill="none"
				stroke="rgba(255,255,255,.15)"
				strokeWidth={stroke}
			/>

			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				fill="none"
				stroke="var(--ui-primary)"
				strokeWidth={stroke}
				strokeDasharray={circumference}
				strokeDashoffset={0}
				transform={`rotate(-90 ${size / 2} ${size / 2})`}
				className="notification-timer-progress"
				style={
					{
						"--circumference": circumference,
						"--duration": `${duration}ms`,
					} as React.CSSProperties
				}
			/>
		</svg>
	);
};
