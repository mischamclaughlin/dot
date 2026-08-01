import type {
    DraftTextElement,
    Rect,
    TextElement,
    ToolType,
} from "../model/DotDocument";
import type { DotState, EditSession } from "../model/DotDocumentState";

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
          type: "resize/area";
          payload: Rect;
      }
    | {
          type: "resize/element";
          payload: {
              id: string;
              area: Rect;
          };
      }
    | {
          type: "canvasMode/switch";
          payload: {
              toolType: ToolType | null;
              area: Rect | null;
          };
      }
    | {
          type: "canvasMode/editElement";
          payload: string;
      }
    | {
          type: "draft/textChanged";
          payload: string;
      };

function createSession(area: Rect): EditSession {
    return {
        editId: null,
        element: {
            toolType: "text",
            area,
            style: { ...initialStyle },
            text: "",
        },
    };
}

export function dotReducer(
    state: DotState = initialState,
    action: Action,
): DotState {
    switch (action.type) {
        // ---------------------------------------------------------------------
        // Action
        case "action/back": {
            if (state.canvasMode.mode === "editing") {
                return {
                    ...state,
                    toolType: null,
                    canvasMode: {
                        mode: "drawing",
                        session: state.canvasMode.session,
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

            const editId = state.canvasMode.session.editId;
            const element: TextElement = {
                id: action.payload.id,
                toolType: action.payload.element.toolType,
                area,
                style: action.payload.element.style,
                text: action.payload.element.text,
            };

            return {
                ...state,
                toolType: null,
                canvasMode: {
                    mode: "idle",
                },
                document: {
                    ...state.document,
                    elements: editId
                        ? state.document.elements.map((existing) =>
                              existing.id === editId ? element : existing,
                          )
                        : [...state.document.elements, element],
                },
            };
        }

        // ---------------------------------------------------------------------
        // CanvasMode
        case "canvasMode/switch": {
            const { toolType, area } = action.payload;

            if (!area) {
                return {
                    ...state,
                    toolType,
                };
            }

            const session =
                state.canvasMode.mode === "idle"
                    ? createSession(area)
                    : {
                          ...state.canvasMode.session,
                          element: {
                              ...state.canvasMode.session.element,
                              area,
                          },
                      };

            return {
                ...state,
                toolType,
                canvasMode: toolType
                    ? {
                          mode: "editing",
                          session,
                      }
                    : {
                          mode: "drawing",
                          session,
                      },
            };
        }

        case "canvasMode/editElement": {
            const element = state.document.elements.find(
                (candidate) => candidate.id === action.payload,
            );
            if (!element) return state;

            return {
                ...state,
                toolType: element.toolType,
                canvasMode: {
                    mode: "editing",
                    session: {
                        editId: element.id,
                        element: {
                            toolType: element.toolType,
                            area: { ...element.area },
                            style: { ...element.style },
                            text: element.text,
                        },
                    },
                },
            };
        }

        // ---------------------------------------------------------------------
        // Draft
        case "draft/textChanged": {
            if (state.canvasMode.mode !== "editing") return state;

            return {
                ...state,
                canvasMode: {
                    ...state.canvasMode,
                    session: {
                        ...state.canvasMode.session,
                        element: {
                            ...state.canvasMode.session.element,
                            text: action.payload,
                        },
                    },
                },
            };
        }

        // ---------------------------------------------------------------------
        // Resize
        case "resize/area": {
            if (state.canvasMode.mode === "idle") return state;

            return {
                ...state,
                canvasMode: {
                    ...state.canvasMode,
                    session: {
                        ...state.canvasMode.session,
                        element: {
                            ...state.canvasMode.session.element,
                            area: action.payload,
                        },
                    },
                },
            };
        }

        case "resize/element": {
            return {
                ...state,
                document: {
                    ...state.document,
                    elements: state.document.elements.map((el) =>
                        el.id === action.payload.id
                            ? {
                                  ...el,
                                  area: action.payload.area,
                              }
                            : el,
                    ),
                },
            };
        }

        // ---------------------------------------------------------------------
        // Default
        default:
            return state;
    }
}
