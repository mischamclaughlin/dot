import type {
    ItemStyle,
    CanvasItem,
    CanvasTool,
    AreaResize,
    AreaStyle,
} from "../types/DotGridTypes";

import { defaultStyle } from "../styles/DotGridStyles";

export type State = {
    activeArea: AreaStyle | null;
    canvasItems: CanvasItem[];
    editedCanvasItems: CanvasItem[];
    itemEdit: CanvasItem | null;
    itemStyle: ItemStyle;
    itemText: string;
    lastSavedItemId: string | null;
    tool: CanvasTool | null;
    toolArea: AreaStyle | null;
};

export type Action =
    | { type: "area/selected"; payload: AreaStyle | null }
    | { type: "area/tool"; payload: AreaStyle }
    | { type: "editing/back" }
    | { type: "editing/cancel" }
    | { type: "editing/item"; payload: string }
    | {
          type: "item/resize";
          payload: {
              id: string;
              nextArea: AreaResize;
          };
      }
    | { type: "item/save"; payload: string }
    | { type: "item/style"; payload: Partial<ItemStyle> }
    | { type: "item/text"; payload: string }
    | { type: "tool/selected"; payload: CanvasTool };

export const initialState: State = {
    activeArea: null,
    canvasItems: [],
    editedCanvasItems: [],
    itemEdit: null,
    itemStyle: defaultStyle,
    itemText: "",
    lastSavedItemId: null,
    tool: null,
    toolArea: null,
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
                itemEdit: null,
                itemText: "",
            };

        case "editing/cancel": {
            return {
                ...state,
                tool: null,
                activeArea: null,
                toolArea: null,
                itemEdit: null,
                itemText: "",
            };
        }

        case "editing/item": {
            const item = state.canvasItems.find((i) => i.id === action.payload);
            if (!item) return state;

            const filteredItems = state.canvasItems.filter(
                (i) => i.id !== action.payload,
            );
            const editedItems = [...state.editedCanvasItems, item];

            return {
                ...state,
                canvasItems: filteredItems,
                editedCanvasItems: editedItems,
                itemEdit: item,
                tool: item.type,
                toolArea: item.area,
                itemStyle: item.style,
                itemText: item.text,
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
                itemEdit: null,
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
