import type {
    AreaStyle,
    CanvasItem,
    CanvasTool,
    NextArea,
    SelectionArea,
} from "../types/DotGridTypes";

import { defaultStyle } from "../styles/DotGridStyles";

export type State = {
    tool: CanvasTool;
    itemStyle: AreaStyle;
    lastSavedItemId: string | null;
    draftArea: SelectionArea | null;
    activeArea: SelectionArea | null;
    toolArea: SelectionArea | null;
    canvasItems: CanvasItem[];
    itemText: string;
};

export type Action =
    | { type: "key/escape" }
    | { type: "item/save-requested" }
    | { type: "item/style"; payload: Partial<AreaStyle> }
    | { type: "item/text"; payload: string }
    | { type: "move/back" }
    | { type: "area/draft"; payload: SelectionArea | null }
    | { type: "area/active"; payload: SelectionArea | null }
    | { type: "area/tool"; payload: SelectionArea | null }
    | { type: "tool/active"; payload: CanvasTool }
    | { type: "canvas/items"; payload: CanvasItem }
    | {
          type: "canvas/item-resize";
          payload: {
              item: CanvasItem;
              nextArea: NextArea;
          };
      };

export const initialState: State = {
    tool: null,
    itemStyle: defaultStyle,
    itemText: "",
    lastSavedItemId: null,
    draftArea: null,
    activeArea: null,
    toolArea: null,
    canvasItems: [],
};

export function dotGridReducer(
    state: State = initialState,
    action: Action,
): State {
    switch (action.type) {
        // ---------------------------------------------------------------------
        // Key
        case "key/escape": {
            return {
                ...state,
                tool: null,
                draftArea: null,
                activeArea: null,
                toolArea: null,
                itemText: "",
            };
        }

        // ---------------------------------------------------------------------
        // Item
        case "item/save-requested": {
            if (!state.toolArea || !state.tool) return state;

            const item: CanvasItem = {
                id: crypto.randomUUID(),
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
        case "tool/active":
            return {
                ...state,
                tool: action.payload,
            };

        // ---------------------------------------------------------------------
        // Move
        case "move/back":
            return {
                ...state,
                tool: null,
                draftArea: null,
                activeArea: null,
                toolArea: null,
                itemText: "",
            };

        // ---------------------------------------------------------------------
        // Area
        case "area/draft":
            return {
                ...state,
                draftArea: action.payload,
            };
        case "area/active":
            return {
                ...state,
                activeArea: action.payload,
                draftArea: null,
            };
        case "area/tool":
            return {
                ...state,
                toolArea: action.payload,
                activeArea: null,
            };

        // ---------------------------------------------------------------------
        // Canvas
        case "canvas/items":
            return {
                ...state,
                canvasItems: [...state.canvasItems, action.payload],
            };
        case "canvas/item-resize":
            return {
                ...state,
                canvasItems: state.canvasItems.map((currentItem) =>
                    currentItem.id === action.payload.item.id &&
                    currentItem.area
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

        // ---------------------------------------------------------------------
        // Default
        default:
            return state;
    }
}
