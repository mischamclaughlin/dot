import type { ReactElement } from "react";
import { useCallback, useState } from "react";

import type { Notification } from "./components/types/NotificationTypes";

import DotGrid from "./components/DotGrid/DotGrid";
import Notifications from "./components/Notifications";

import "./App.css";
// -----------------------------------------------------------------------------

export default function App(): ReactElement {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const handleNotifications = useCallback(
        (lastSavedItemId: string | null) => {
            if (!lastSavedItemId) return;

            setNotifications((current) => [
                ...current,
                {
                    id: crypto.randomUUID(),
                    type: "success",
                    subtype: "saved",
                    message: "Saved.",
                },
            ]);
        },
        [],
    );

    function handleDeleteNotification(id: string) {
        setNotifications((current) =>
            current.filter((notif) => notif.id !== id),
        );
    }

    return (
        <div className="appContainer">
            <Notifications
                notifications={notifications}
                onDeleteNotification={handleDeleteNotification}
            />
            <DotGrid onNotifications={handleNotifications} />
        </div>
    );
}
