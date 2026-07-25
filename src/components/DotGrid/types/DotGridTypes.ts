import type { CSSProperties } from "react";

export type Dot = { x: number; y: number };

export type AreaStyle = {
    left: number;
    top: number;
    width: number;
    height: number;
};

export type ItemStyle = Pick<
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
    style: ItemStyle;
    area: AreaStyle;
};

export type EdgeResize = "left" | "right" | "top" | "bottom";
export type AreaResize =
    | { left: number; width: number }
    | { top: number; height: number };
