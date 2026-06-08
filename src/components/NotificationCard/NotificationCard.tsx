import { Notification } from "../../domain";
import "./NotificationCard.css";
import { NotificationTimer } from "./NotificationTimer/NotificationTimer";

type Props = {
	notification: Notification;
};

export const NotificationCard = ({ notification }: Props) => {
	return (
		<div className={`notification ${notification.type}`}>
			<div className="notification-header">
				<div>
					<div className="notification-title">{notification.title}</div>

					{notification.message && (
						<div className="notification-message">{notification.message}</div>
					)}
				</div>

				<NotificationTimer duration={(notification.duration ?? 3000) - 1000} />
			</div>
		</div>
	);
};
