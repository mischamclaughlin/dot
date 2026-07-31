import type {
    DraftTextElement,
    Rect,
    TextElement,
    ToolType,
} from "../model/DotDocument";
import type { DotState } from "../model/DotDocumentState";

import { initialState, initialStyle } from "./DotInitialState";
// -----------------------------------------------------------------------------

export type Action =
    | { type: "action/back" }
    | { type: "action/cancel" }
    | {
          type: "action/save";
          payload: {
              id: string;
              element: DraftTextElement;
          };
      }
    | {
          type: "area/resize";
          payload: Rect;
      }
    | {
          type: "canvasMode/switch";
          payload: {
              toolType: ToolType | null;
              area: Rect | null;
          };
      };

export function dotReducer(
    state: DotState = initialState,
    action: Action,
): DotState {
    switch (action.type) {
        // ---------------------------------------------------------------------
        // Action
        case "action/back": {
            if (state.canvasMode.mode === "editing") {
                if (!state.canvasMode.element.area) {
                    return {
                        ...state,
                        toolType: null,
                        canvasMode: {
                            mode: "idle",
                        },
                    };
                }

                return {
                    ...state,
                    toolType: null,
                    canvasMode: {
                        mode: "drawing",
                        area: state.canvasMode.element.area,
                    },
                };
            }

            return {
                ...state,
                toolType: null,
                canvasMode: {
                    mode: "idle",
                },
            };
        }

        case "action/cancel": {
            return {
                ...state,
                toolType: null,
                canvasMode: {
                    mode: "idle",
                },
            };
        }

        case "action/save": {
            if (state.canvasMode.mode !== "editing") return state;

            const area = action.payload.element.area;
            if (!area) return state;

            const element: TextElement = {
                id: action.payload.id,
                toolType: "text",
                area: area,
                style: action.payload.element.style,
                text: action.payload.element.text,
            };

            return {
                ...state,
                document: {
                    ...state.document,
                    elements: [...state.document.elements, element],
                },
            };
        }

        // ---------------------------------------------------------------------
        // CanvasMode
        case "canvasMode/switch": {
            if (action.payload.toolType) {
                return {
                    ...state,
                    toolType: action.payload.toolType,
                    canvasMode: {
                        ...state.canvasMode,
                        mode: "editing",
                        editId: null,
                        element: {
                            toolType: "text",
                            area: action.payload.area,
                            style: initialStyle,
                            text: "",
                        },
                    },
                };
            }

            if (action.payload.area) {
                return {
                    ...state,
                    toolType: action.payload.toolType,
                    canvasMode: {
                        ...state.canvasMode,
                        mode: "drawing",
                        area: action.payload.area,
                    },
                };
            }

            return state;
        }

        // ---------------------------------------------------------------------
        // Area
        case "area/resize": {
            if (state.canvasMode.mode === "drawing") {
                return {
                    ...state,
                    canvasMode: {
                        ...state.canvasMode,
                        area: action.payload,
                    },
                };
            }

            if (state.canvasMode.mode === "editing") {
                return {
                    ...state,
                    canvasMode: {
                        ...state.canvasMode,
                        element: {
                            ...state.canvasMode.element,
                            area: action.payload,
                        },
                    },
                };
            }

            return state;
        }

        // ---------------------------------------------------------------------
        // Default
        default:
            return state;
    }
}
