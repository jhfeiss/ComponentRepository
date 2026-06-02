import "./NumberRing.css";

type Props = {
	value: number; // 0 - 99
	size?: number;
	stroke?: number;
	label?: string;
};

const clamp = (v: number, min = 0, max = 99) => Math.min(max, Math.max(min, v));

const getColor = (value: number) => {
	const v = clamp(value);

	// RED ZONE (< 60)
	if (v < 60) {
		const t = v / 60;

		// starts dull red → ends bright red
		const r = 200 + Math.floor(55 * t); // 200 → 255
		const g = Math.floor(40 * t); // 0 → 40
		const b = Math.floor(40 * t); // 0 → 40

		return `rgb(${r}, ${g}, ${b})`;
	}

	// YELLOW ZONE (60–69)
	if (v < 70) {
		const t = (v - 60) / 10;

		// warm gold → saturated yellow
		const r = 255;
		const g = 160 + Math.floor(95 * t); // 160 → 255
		const b = 40 + Math.floor(40 * t); // 40 → 80

		return `rgb(${r}, ${g}, ${b})`;
	}

	// GREEN ZONE (70+)
	const t = (v - 70) / 29;

	// muted green → neon green
	const r = Math.floor(40 * (1 - t)); // 40 → 0
	const g = 200 + Math.floor(55 * t); // 200 → 255
	const b = Math.floor(120 * (1 - t)); // 120 → 0

	return `rgb(${r}, ${g}, ${b})`;
};

const clamp255 = (v: number) => Math.max(0, Math.min(255, v));

const adjustColor = (rgb: string, amount: number) => {
	const match = rgb.match(/\d+/g);
	if (!match) return rgb;

	let [r, g, b] = match.map(Number);

	r = clamp255(r + amount);
	g = clamp255(g + amount);
	b = clamp255(b + amount);

	return `rgb(${r}, ${g}, ${b})`;
};

export const NumberRing = ({
	value,
	size = 125,
	stroke = 16,
	label,
}: Props) => {
	const v = clamp(value);

	const radius = (size - stroke) / 2;
	const circumference = 2 * Math.PI * radius;
	const progress = v / 99;

	const offset = circumference * (1 - progress);

	const color = getColor(v);

	const base = color;
	const light = adjustColor(color, 40); // brighter
	const dark = adjustColor(color, -40); // darker

	return (
		<svg
			width={size}
			height={size}
		>
			<circle
				stroke="#000000d2"
				fill="transparent"
				strokeWidth={stroke}
				r={radius}
				cx={size / 2}
				cy={size / 2}
			/>

			<defs>
				<linearGradient
					id="ringStrokeGradient"
					x1="0%"
					y1="0%"
					x2="100%"
					y2="0%"
				>
					<stop
						offset="0%"
						stopColor={light}
					/>
					<stop
						offset="50%"
						stopColor={base}
					/>
					<stop
						offset="100%"
						stopColor={dark}
					/>
				</linearGradient>
			</defs>
			<circle
				stroke="url(#ringStrokeGradient)"
				fill="transparent"
				strokeWidth={stroke}
				r={radius}
				cx={size / 2}
				cy={size / 2}
				strokeDasharray={circumference}
				strokeDashoffset={offset}
				transform={`rotate(-90 ${size / 2} ${size / 2})`}
			/>
			<text
				x="50%"
				y="52.5%"
				textAnchor="middle"
				dominantBaseline="middle"
				fontSize="36"
				fontWeight="bold"
				className="ring-text"
			>
				{v}
			</text>
			{label && (
				<text
					x="50%"
					y="70%"
					textAnchor="middle"
					dominantBaseline="middle"
					fontSize="14"
					className="ring-text"
				>
					{label}
				</text>
			)}
		</svg>
	);
};
