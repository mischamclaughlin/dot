import type {
    DotDocument,
    DraftTextElement,
    ToolType,
} from "./DotDocument";
// -----------------------------------------------------------------------------

export type EditSession = {
    editId: string | null;
    element: DraftTextElement;
};

export type CanvasMode =
    | { mode: "idle" }
    | { mode: "drawing"; session: EditSession }
    | { mode: "editing"; session: EditSession };

export type DotState = {
    document: DotDocument;
    selectedElementIds: ReadonlySet<string>;
    toolType: ToolType | null;
    canvasMode: CanvasMode;
};
