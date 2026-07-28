import type {
    Rect,
    SquareDotItem,
    TextStyle,
} from "../../../model/SquareDotDocument";
import type { AreaResize } from "../DotGridTypes";
import type { SquareDotState } from "./types/StateTypes";
// -----------------------------------------------------------------------------

export type Action =
    | { type: "area/selected"; payload: Rect }
    | { type: "area/tool"; payload: Rect }
    | { type: "editing/back" }
    | { type: "editing/cancel" }
    | { type: "editing/item"; payload: string }
    | {
          type: "item/padding";
          payload: {
              side: "top" | "right" | "bottom" | "left";
              direction: "down" | "up";
          };
      }
    | {
          type: "item/resize";
          payload: {
              id: string;
              nextArea: AreaResize;
          };
      }
    | { type: "item/save"; payload: string }
    | { type: "item/style"; payload: Partial<TextStyle> }
    | { type: "item/text"; payload: string }
    | { type: "tool/selected"; payload: SquareDotItem };

export const initialState: SquareDotState = {
    document: {
        schemaVersion: 1,
        items: [],
    },
    mode: {
        kind: "idle",
    },
};

const initialStyle: TextStyle = {
    alignContent: "center",
    alignText: "left",
    colourBackground: "#faf4ed",
    colourForeground: "#464261",
    fontSize: 1,
    fontWeight: 400,
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
};

const paddingProperty = {
    top: "paddingTop",
    right: "paddingRight",
    bottom: "paddingBottom",
    left: "paddingLeft",
} as const;

function assertNever(action: never): never {
    throw new Error(`Unhandled reducer action ${JSON.stringify(action)}`);
}

export function squareDotReducer(
    state: SquareDotState = initialState,
    action: Action,
): SquareDotState {
    switch (action.type) {
        // ---------------------------------------------------------------------
        // Area
        case "area/selected":
            if (
                state.mode.kind !== "idle" &&
                state.mode.kind !== "area-selected"
            ) {
                return state;
            }

            return {
                ...state,
                mode: action.payload
                    ? {
                          kind: "area-selected",
                          area: action.payload,
                      }
                    : {
                          kind: "idle",
                      },
            };

        case "area/tool":
            if (state.mode.kind !== "area-selected") {
                return state;
            }

            return {
                ...state,
                mode: {
                    kind: "editing",
                    originalItemId: null,
                    draft: {
                        toolType: "text",
                        area: action.payload,
                        text: "",
                        style: initialStyle,
                    },
                },
            };

        // ---------------------------------------------------------------------
        // Editing
        case "editing/back":
            return {
                ...state,
                mode: {
                    kind: "idle",
                },
            };

        case "editing/cancel": {
            return {
                ...state,
                mode: {
                    kind: "idle",
                },
            };
        }

        case "editing/item": {
            const item = state.document.items.find(
                (i) => i.id === action.payload,
            );
            if (!item) return state;

            const filteredItems = state.document.items.filter(
                (i) => i.id !== action.payload,
            );

            return {
                ...state,
                document: {
                    ...state.document,
                    items: filteredItems,
                },
                mode: {
                    kind: "editing",
                    originalItemId: action.payload,
                    draft: {
                        toolType: "text",
                        area: item.area,
                        style: item.style,
                        text: item.text,
                    },
                },
            };
        }

        // ---------------------------------------------------------------------
        // Item
        case "item/padding": {
            if (
                state.mode.kind !== "editing" ||
                state.mode.draft.toolType !== "text"
            ) {
                return state;
            }

            const property = paddingProperty[action.payload.side];
            const currentPadding = state.mode.draft.style[property];

            const nextPadding =
                action.payload.direction === "up"
                    ? currentPadding + 1
                    : Math.max(0, currentPadding - 1);

            return {
                ...state,
                mode: {
                    ...state.mode,
                    draft: {
                        ...state.mode.draft,
                        style: {
                            ...state.mode.draft.style,
                            [property]: nextPadding,
                        },
                    },
                },
            };
        }

        case "item/resize":
            return {
                ...state,
                document: {
                    ...state.document,
                    items: state.document.items.map((currentItem) =>
                        currentItem.id === action.payload.id
                            ? {
                                  ...currentItem,
                                  area: {
                                      ...currentItem.area,
                                      ...action.payload.nextArea,
                                  },
                              }
                            : currentItem,
                    ),
                },
            };

        case "item/save": {
            if (state.mode.kind !== "editing") return state;

            const item: SquareDotItem = {
                id: action.payload,
                area: state.mode.draft.area,
                toolType: state.mode.draft.toolType,
                style: state.mode.draft.style,
                text: state.mode.draft.text,
            };

            return {
                ...state,
                document: {
                    ...state.document,
                    items: [...state.document.items, item],
                },
                mode: { kind: "idle" },
            };
        }

        case "item/style":
            if (
                state.mode.kind !== "editing" ||
                state.mode.draft.toolType !== "text"
            ) {
                return state;
            }

            return {
                ...state,
                mode: {
                    ...state.mode,
                    draft: {
                        ...state.mode.draft,
                        style: {
                            ...state.mode.draft.style,
                            ...action.payload,
                        },
                    },
                },
            };

        case "item/text":
            if (
                state.mode.kind !== "editing" ||
                state.mode.draft.toolType !== "text"
            ) {
                return state;
            }

            console.log(state);
            return {
                ...state,
                mode: {
                    ...state.mode,
                    draft: {
                        ...state.mode.draft,
                        text: action.payload,
                    },
                },
            };

        // ---------------------------------------------------------------------
        // Tool
        case "tool/selected":
            if (state.mode.kind !== "editing") {
                return state;
            }

            return {
                ...state,
                mode: {
                    ...state.mode,
                    draft: {
                        ...state.mode.draft,
                        toolType: action.payload.toolType,
                    },
                },
            };

        // ---------------------------------------------------------------------
        // Default
        default:
            return assertNever(action);
    }
}
