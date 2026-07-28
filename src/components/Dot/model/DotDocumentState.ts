import type { CanvasDot, Rect, ToolType } from "./DotDocument";
// -----------------------------------------------------------------------------

export type CanvasMode =
    | {
          mode: "idle";
          tool: ToolType;
      }
    | {
          mode: "selected";
          tool: ToolType;
          area: Rect;
      }
    | {
          mode: "editing";
          tool: ToolType;
          area: Rect;
          style: CanvasDot;
      };
