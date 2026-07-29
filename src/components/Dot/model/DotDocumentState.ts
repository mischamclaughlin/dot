import type { CanvasElement, DotDocument, Rect, ToolType } from "./DotDocument";
// -----------------------------------------------------------------------------

export type CanvasElementDraft = Omit<CanvasElement, "id">;

export type CanvasMode =
    | { mode: "idle" }
    | { mode: "drawing"; area: Rect }
    | { mode: "editing"; editId: string | null; element: CanvasElementDraft };

export type DotState = {
    document: DotDocument;
    toolType: ToolType | null;
    canvasMode: CanvasMode;
};
