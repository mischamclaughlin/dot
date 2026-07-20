import DotGrid from "./components/DotGrid/DotGrid";
import Notifications from "./components/Notifications";

import "./App.css";
import { useState } from "react";

type NotificationType = "success" | "info" | "error";
type NotificationSubtype = "saved" | "delted" | "edited" | "create";

type Notification = {
    type: NotificationType;
    subtype: NotificationSubtype;
    message: string;
};

export default function App() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    function handleNotifications(isSaved: boolean) {
        if (!isSaved) return;

        const notification = {
            type: "success",
            subtype: "saved",
            message: "Saved successfully.",
        } satisfies Notification;

        setNotifications((current) => [...current, notification]);
    }

    return (
        <>
            <div className="appContainer">
                <Notifications notifications={notifications} />
                <DotGrid onNotifications={handleNotifications} />
            </div>
        </>
    );
}
