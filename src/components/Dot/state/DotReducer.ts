import type { Rect, TextStyle, ToolType } from "../model/DotDocument";
import type { DotState } from "../model/DotDocumentState";
// -----------------------------------------------------------------------------

export type Action =
    | {
          type: "canvasMode/switch";
          payload: {
              toolType: ToolType | null;
              area: Rect;
          };
      }
    | { type: "canvasMode/back" }
    | { type: "canvasMode/cancel" };

export const initialState: DotState = {
    document: {
        schemaVersion: 1,
        elements: [],
    },
    toolType: null,
    canvasMode: {
        mode: "idle",
    },
};

export const initialStyle: TextStyle = {
    alignContent: "center",
    alignText: "left",
    colourBackground: "#faf4ed",
    colourForeground: "#464261",
    fontSize: 1,
    fontWeight: 300,
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
};

export const initialRect: Rect = { left: 0, width: 0, top: 0, height: 0 };

export function dotReducer(
    state: DotState = initialState,
    action: Action,
): DotState {
    switch (action.type) {
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
            } else {
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
        }

        case "canvasMode/back": {
            if (state.canvasMode.mode === "editing") {
                if (state.canvasMode.element.area == initialRect) {
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

        case "canvasMode/cancel": {
            return {
                ...state,
                toolType: null,
                canvasMode: {
                    mode: "idle",
                },
            };
        }

        default:
            return state;
    }
}
