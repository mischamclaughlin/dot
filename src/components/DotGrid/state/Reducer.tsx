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
    activeStyle: AreaStyle;
    isSaved: boolean;
    isBack: boolean;
    draftArea: SelectionArea | null;
    activeArea: SelectionArea | null;
    toolArea: SelectionArea | null;
    canvasItems: CanvasItem[];
};

export type Action =
    | { type: "tool/active"; payload: CanvasTool }
    | { type: "style/active"; payload: Partial<AreaStyle> }
    | { type: "save/confirm"; payload: boolean }
    | { type: "move/back"; payload: boolean }
    | { type: "area/draft"; payload: SelectionArea | null }
    | { type: "area/active"; payload: SelectionArea | null }
    | { type: "area/tool"; payload: SelectionArea | null }
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
    activeStyle: defaultStyle,
    isSaved: false,
    isBack: false,
    draftArea: null,
    activeArea: null,
    toolArea: null,
    canvasItems: [],
};

export function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        // ---------------------------------------------------------------------
        // Tool
        case "tool/active":
            return {
                ...state,
                tool: action.payload,
            };

        // ---------------------------------------------------------------------
        // Style
        case "style/active":
            return {
                ...state,
                activeStyle: {
                    ...state.activeStyle,
                    ...action.payload,
                },
            };

        // ---------------------------------------------------------------------
        // Save
        case "save/confirm":
            return {
                ...state,
                isSaved: action.payload,
            };

        // ---------------------------------------------------------------------
        // Move
        case "move/back":
            return {
                ...state,
                isBack: action.payload,
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
