import { type ReactElement } from "react";

import styles from "./Notifications.module.css";

type NotificationType = "success" | "info" | "error";
type NotificationSubtype = "saved" | "delted" | "edited" | "create";

type Notification = {
    id: string;
    type: NotificationType;
    subtype: NotificationSubtype;
    message: string;
};

type NotificationsProps = {
    notifications: Notification[];
    onDeleteNotification: (id: string) => void;
};

export default function Notifications({
    notifications,
    onDeleteNotification,
}: NotificationsProps): ReactElement {
    if (notifications.length === 0) return <></>;

    const notificationTypeStyle = (notif: Notification) =>
        notif.type === "success"
            ? styles.success
            : notif.type === "error"
              ? styles.error
              : notif.type === "info"
                ? styles.info
                : "";

    return (
        <>
            <div className={styles.container}>
                {notifications.map((notif) => (
                    <div
                        key={notif.id}
                        className={styles.notificationContainer}
                    >
                        <div
                            className={`
                                ${styles.sectionContainer}
                                ${notificationTypeStyle(notif)}
                            `}
                        >
                            <p className={styles.message}>{notif.message}</p>
                        </div>
                        <div
                            className={`
                                ${styles.sectionContainer}
                                ${notificationTypeStyle(notif)}
                            `}
                        >
                            <button
                                data-id={notif.id}
                                className={styles.button}
                                onClick={() => onDeleteNotification(notif.id)}
                            >
                                X
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
