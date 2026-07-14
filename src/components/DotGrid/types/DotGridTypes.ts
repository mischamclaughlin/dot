export type DotSelection = { x: number; y: number };

export type SelectionArea = {
    left: number;
    top: number;
    width: number;
    height: number;
};

export type CanvasTool = "text" | "image" | "component" | "describe" | null;
