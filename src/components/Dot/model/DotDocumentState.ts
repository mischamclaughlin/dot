import type {
    DotDocument,
    DraftTextElement,
    Rect,
    ToolType,
} from "./DotDocument";
// -----------------------------------------------------------------------------

export type CanvasMode =
    | { mode: "idle" }
    | { mode: "drawing"; area: Rect }
    | { mode: "editing"; editId: string | null; element: DraftTextElement };

export type DotState = {
    document: DotDocument;
    toolType: ToolType | null;
    canvasMode: CanvasMode;
};
