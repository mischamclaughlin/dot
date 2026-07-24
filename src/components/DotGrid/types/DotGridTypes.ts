import type { CSSProperties } from "react";

export type Dot = { x: number; y: number };

export type SelectionArea = {
    left: number;
    top: number;
    width: number;
    height: number;
};

export type AreaStyle = Pick<
    CSSProperties,
    | "fontSize"
    | "fontWeight"
    | "textAlign"
    | "alignContent"
    | "color"
    | "backgroundColor"
>;

export type CanvasTool = "text" | "image" | "component" | "describe";

export type CanvasItem = {
    id: string;
    type: CanvasTool;
    text: string;
    style: AreaStyle;
    area: SelectionArea;
};

export type NotificationType = "success" | "info" | "error";
export type NotificationSubtype = "saved" | "deleted" | "edited" | "create";

export type Notification = {
    id: string;
    type: NotificationType;
    subtype: NotificationSubtype;
    message: string;
};

export type ResizeEdge = "left" | "right" | "top" | "bottom";

export type NextArea =
    | { left: number; width: number }
    | { top: number; height: number };
