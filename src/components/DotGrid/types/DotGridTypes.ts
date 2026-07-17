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

export type CanvasTool = "text" | "image" | "component" | "describe" | null;

export type CanvasItem = {
    id: string;
    type: CanvasTool;
    text: string;
    style: AreaStyle | null;
    area: SelectionArea | null;
};
