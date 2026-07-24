import type {
    AreaStyle,
    CanvasItem,
    CanvasTool,
    NextArea,
    SelectionArea,
} from "../types/DotGridTypes";

import { defaultStyle } from "../styles/DotGridStyles";

export type State = {
    tool: CanvasTool | null;
    itemStyle: AreaStyle;
    lastSavedItemId: string | null;
    activeArea: SelectionArea | null;
    toolArea: SelectionArea | null;
    canvasItems: CanvasItem[];
    itemText: string;
};

export type Action =
    | { type: "area/selected"; payload: SelectionArea | null }
    | { type: "area/tool"; payload: SelectionArea }
    | { type: "editing/back" }
    | { type: "editing/cancel" }
    | {
          type: "item/resize";
          payload: {
              id: string;
              nextArea: NextArea;
          };
      }
    | { type: "item/save"; payload: string }
    | { type: "item/style"; payload: Partial<AreaStyle> }
    | { type: "item/text"; payload: string }
    | { type: "tool/selected"; payload: CanvasTool };

export const initialState: State = {
    tool: null,
    itemStyle: defaultStyle,
    itemText: "",
    lastSavedItemId: null,
    activeArea: null,
    toolArea: null,
    canvasItems: [],
};

function assertNever(action: never): never {
    throw new Error(`Unhandled reducer action ${JSON.stringify(action)}`);
}

export function dotGridReducer(
    state: State = initialState,
    action: Action,
): State {
    switch (action.type) {
        // ---------------------------------------------------------------------
        // Area
        case "area/selected":
            return {
                ...state,
                activeArea: action.payload,
            };

        case "area/tool":
            return {
                ...state,
                toolArea: action.payload,
                activeArea: null,
            };

        // ---------------------------------------------------------------------
        // Editing
        case "editing/back":
            return {
                ...state,
                activeArea: state.toolArea,
                toolArea: null,
                tool: null,
                itemText: "",
            };

        case "editing/cancel": {
            return {
                ...state,
                tool: null,
                activeArea: null,
                toolArea: null,
                itemText: "",
            };
        }

        // ---------------------------------------------------------------------
        // Item
        case "item/resize":
            return {
                ...state,
                canvasItems: state.canvasItems.map((currentItem) =>
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
            };

        case "item/save": {
            if (!state.toolArea || !state.tool) return state;

            const item: CanvasItem = {
                id: action.payload,
                type: state.tool,
                text: state.itemText,
                style: state.itemStyle,
                area: state.toolArea,
            };

            return {
                ...state,
                canvasItems: [...state.canvasItems, item],
                toolArea: null,
                lastSavedItemId: item.id,
                itemText: "",
            };
        }

        case "item/style":
            return {
                ...state,
                itemStyle: {
                    ...state.itemStyle,
                    ...action.payload,
                },
            };

        case "item/text":
            return {
                ...state,
                itemText: action.payload,
            };

        // ---------------------------------------------------------------------
        // Tool
        case "tool/selected":
            return {
                ...state,
                tool: action.payload,
                toolArea: state.activeArea,
                activeArea: null,
            };

        // ---------------------------------------------------------------------
        // Default
        default:
            return assertNever(action);
    }
}
