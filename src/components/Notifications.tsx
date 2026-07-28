import type { CSSProperties, ReactElement } from "react";
import { useLayoutEffect, useRef, useState } from "react";

import type { Notification } from "./model/NotificationTypes";

import styles from "./Notifications.module.css";
// -----------------------------------------------------------------------------

type NotificationsProps = {
    notifications: Notification[];
    onDeleteNotification: (id: string) => void;
};

export default function Notifications({
    notifications,
    onDeleteNotification,
}: NotificationsProps): ReactElement {
    const refs = useRef<(HTMLDivElement | null)[]>([]);
    const [offsets, setOffsets] = useState<number[]>([]);

    useLayoutEffect(() => {
        refs.current = refs.current.slice(0, notifications.length);

        let running = 0;
        const nextOffsets = notifications.map((_, index) => {
            const currentTop = running;
            running += refs.current[index]?.offsetHeight ?? 0;

            return currentTop;
        });

        setOffsets(nextOffsets);
    }, [notifications]);

    const zIndexMax = 1000;
    const maxStackedNotifications = 70;

    if (notifications.length === 0) return <></>;

    const notificationTypeStyle = (type: Notification["type"]) =>
        type === "success"
            ? styles.success
            : type === "error"
              ? styles.error
              : type === "info"
                ? styles.info
                : "";

    const notificationStacked = (index: number) =>
        index < maxStackedNotifications
            ? ({
                  position: "absolute",
                  zIndex: zIndexMax - (index + 1),
                  top: `${(offsets[index] ?? 0) - index * 15}px`,
                  right: 0,
                  filter: `${index === 0 ? "brightness(1)" : "brightness(0.9)"}`,
              } satisfies CSSProperties)
            : ({ display: "none" } satisfies CSSProperties);

    return (
        <div className={styles.container} style={{ zIndex: zIndexMax }}>
            {notifications.map((notif, index) => (
                <div
                    key={notif.id}
                    className={styles.notificationContainer}
                    style={notificationStacked(index)}
                    ref={(el) => {
                        refs.current[index] = el;
                    }}
                >
                    <div
                        className={`
                                ${styles.sectionContainer}
                                ${notificationTypeStyle(notif.type)}
                            `}
                    >
                        <p className={styles.message}>{notif.message}</p>
                    </div>
                    <div
                        className={`
                                ${styles.sectionContainer}
                                ${notificationTypeStyle(notif.type)}
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
    );
}
