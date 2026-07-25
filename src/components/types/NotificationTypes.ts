export type NotificationType = "success" | "info" | "error";

export type NotificationSubtype = "saved" | "deleted" | "edited" | "create";

export type Notification = {
    id: string;
    type: NotificationType;
    subtype: NotificationSubtype;
    message: string;
};
