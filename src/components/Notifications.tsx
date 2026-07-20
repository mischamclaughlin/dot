import { type ReactElement } from "react";

import styles from "./Notifications.module.css";

type NotificationType = "success" | "info" | "error";
type NotificationSubtype = "saved" | "delted" | "edited" | "create";

type Notification = {
    type: NotificationType;
    subtype: NotificationSubtype;
    message: string;
};

type NotificationsProps = { notifications: Notification[] };

export default function Notifications({
    notifications,
}: NotificationsProps): ReactElement {
    if (notifications.length === 0) return <></>;

    return (
        <>
            <div className={styles.container}>
                {notifications.map((notif) => (
                    <div
                        key={`${notif.type}-${notif.subtype}`}
                        className={`
                                ${styles.notificationContainer}
                                ${
                                    notif.type === "success"
                                        ? styles.success
                                        : notif.type === "error"
                                          ? styles.error
                                          : notif.type === "info"
                                            ? styles.info
                                            : ""
                                }
                            `}
                    >
                        <p>{notif.message}</p>
                    </div>
                ))}
            </div>
        </>
    );
}
