import "./SplitPlane.css";
import { useRef } from "react";

type Props = {
	left: React.ReactNode;
	right: React.ReactNode;

	initialLeftWidth?: number;
	minLeftWidth?: number;
	maxLeftWidth?: number;

	resizerWidth?: number;
	onResizeEnd?: (width: number) => void;
	leftOverflow?: any;
	rightOverflow?: any;
};

export const SplitPane = ({
	left,
	right,
	initialLeftWidth = 300,
	minLeftWidth = 200,
	maxLeftWidth = 800,
	resizerWidth = 3,
	onResizeEnd,
	leftOverflow = { x: "hidden", y: "hidden" },
	rightOverflow = { x: "hidden", y: "hidden" },
}: Props) => {
	const containerRef = useRef<HTMLDivElement>(null);

	const startResize = (e: React.PointerEvent) => {
		e.preventDefault();

		const container = containerRef.current!;
		const startX = e.clientX;

		const leftPane = container.querySelector(".split-left") as HTMLElement;

		let startWidth = leftPane.getBoundingClientRect().width;

		const onMove = (moveEvent: PointerEvent) => {
			const delta = moveEvent.clientX - startX;

			let newWidth = startWidth + delta;

			newWidth = Math.max(minLeftWidth, Math.min(maxLeftWidth, newWidth));

			container.style.gridTemplateColumns = `${newWidth}px ${resizerWidth}px 1fr`;
		};

		const onUp = () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);

			const finalWidth = parseInt(
				container.style.gridTemplateColumns.split("px")[0],
			);

			onResizeEnd?.(finalWidth);
		};

		window.addEventListener("pointermove", onMove);
		window.addEventListener("pointerup", onUp);
	};

	return (
		<div
			ref={containerRef}
			className="split-pane"
			style={{
				gridTemplateColumns: `${initialLeftWidth}px ${resizerWidth}px 1fr`,
			}}
		>
			<div
				className="split-left"
				style={{ overflowX: leftOverflow.x, overflowY: leftOverflow.y }}
			>
				{left}
			</div>

			<div
				className="split-resizer"
				onPointerDown={startResize}
			/>

			<div
				className="split-right"
				style={{ overflowX: rightOverflow.x, overflowY: rightOverflow.y }}
			>
				{right}
			</div>
		</div>
	);
};
