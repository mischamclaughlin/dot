export type Dot = { x: number; y: number };

export type SelectionArea = {
    left: number;
    top: number;
    width: number;
    height: number;
};

type Variant = "title" | "subTitle" | "heading" | "subHeading" | "body" | null;
type Align = "left" | "right" | "center" | "justify" | null;

export type AreaStyle = {
    variant?: Variant;
    align?: Align;
};

export type CanvasTool = "text" | "image" | "component" | "describe" | null;

export type CanvasItem = {
    id: string;
    type: CanvasTool;
    text: string;
    style: AreaStyle | null;
    area: SelectionArea | null;
};
