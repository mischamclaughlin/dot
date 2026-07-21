import DotGrid from "./components/DotGrid/DotGrid";
import Notifications from "./components/Notifications";

import "./App.css";
import { useState } from "react";
import type { Notification } from "./components/DotGrid/types/DotGridTypes";

export default function App() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    function handleNotifications(isSaved: boolean) {
        if (!isSaved) return;

        const notification = {
            id: crypto.randomUUID(),
            type: "success",
            subtype: "saved",
            message: "Saved successfully.",
        } satisfies Notification;

        setNotifications((current) => [...current, notification]);
    }

    function handleDeleteNotification(id: string) {
        setNotifications((current) =>
            current.filter((notif) => notif.id !== id),
        );
    }

    return (
        <>
            <div className="appContainer">
                <Notifications
                    notifications={notifications}
                    onDeleteNotification={handleDeleteNotification}
                />
                <DotGrid onNotifications={handleNotifications} />
            </div>
        </>
    );
}
