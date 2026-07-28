import type {
    Rect,
    SquareDotDocument,
    TextItem,
} from "../../../../model/SquareDotDocument";
// -----------------------------------------------------------------------------

export type TextItemDraft = Omit<TextItem, "id">;

export type EditorMode =
    | { kind: "idle" }
    | {
          kind: "area-selected";
          area: Rect;
      }
    | {
          kind: "editing";
          originalItemId: string | null;
          draft: TextItemDraft;
      };

export type ToolType = "text";

export type SquareDotState = {
    document: SquareDotDocument;
    selectedTool: ToolType | null;
    mode: EditorMode;
};
