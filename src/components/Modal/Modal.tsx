import { useEffect } from "react";
import "./Modal.css";

type ModalProps = {
	open: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
};

export const Modal = ({ open, onClose, title, children }: ModalProps) => {
	// ESC to close
	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		if (open) window.addEventListener("keydown", onKeyDown);

		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div
			className="modal-overlay"
			onMouseDown={onClose}
		>
			<div
				className="modal-window"
				onMouseDown={(e) => e.stopPropagation()}
			>
				{title && (
					<div className="modal-header">
						<h2>{title}</h2>
						<button onClick={onClose}>✕</button>
					</div>
				)}

				<div className="modal-body">{children}</div>
			</div>
		</div>
	);
};
