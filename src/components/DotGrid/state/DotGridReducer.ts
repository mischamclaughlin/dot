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
    draftArea: SelectionArea | null;
    activeArea: SelectionArea | null;
    toolArea: SelectionArea | null;
    canvasItems: CanvasItem[];
    itemText: string;
};

export type Action =
    | { type: "editing/cancel" }
    | { type: "editing/back" }
    | { type: "item/save"; payload: string }
    | { type: "item/style"; payload: Partial<AreaStyle> }
    | { type: "item/text"; payload: string }
    | { type: "area/draft"; payload: SelectionArea | null }
    | { type: "area/selected"; payload: SelectionArea | null }
    | { type: "area/tool"; payload: SelectionArea | null }
    | { type: "tool/selected"; payload: CanvasTool }
    | {
          type: "canvas/resize";
          payload: {
              id: string;
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

function assertNever(action: never): never {
    throw new Error(`Unhandled reducer action ${JSON.stringify(action)}`);
}

export function dotGridReducer(
    state: State = initialState,
    action: Action,
): State {
    switch (action.type) {
        // ---------------------------------------------------------------------
        // Key
        case "editing/cancel": {
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
        // Move
        case "editing/back":
            return {
                ...state,
                activeArea: state.toolArea,
                toolArea: null,
                tool: null,
                itemText: "",
            };

        // ---------------------------------------------------------------------
        // Area
        case "area/draft":
            return {
                ...state,
                draftArea: action.payload,
            };
        case "area/selected":
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
        case "canvas/resize":
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

        // ---------------------------------------------------------------------
        // Default
        default:
            return assertNever(action);
    }
}
