import { defaultStyle } from "../styles/DotGridStyles";
import type {
    AreaStyle,
    CanvasTool,
    SelectionArea,
} from "../types/DotGridTypes";

export type State = {
    tool: CanvasTool;
    activeStyle: AreaStyle;
    isSavePossible: boolean;
    isSaved: boolean;
    isBack: boolean;
    draftArea: SelectionArea | null;
    activeArea: SelectionArea | null;
    toolArea: SelectionArea | null;
};

export type Action =
    | { type: "tool/active"; payload: CanvasTool }
    | { type: "style/active"; payload: Partial<AreaStyle> }
    | { type: "save/possible"; payload: boolean }
    | { type: "save/confirm"; payload: boolean }
    | { type: "move/back"; payload: boolean }
    | { type: "area/draft"; payload: SelectionArea | null }
    | { type: "area/active"; payload: SelectionArea | null }
    | { type: "area/tool"; payload: SelectionArea | null };

export const initialState: State = {
    tool: null,
    activeStyle: defaultStyle,
    isSavePossible: false,
    isSaved: false,
    isBack: false,
    draftArea: null,
    activeArea: null,
    toolArea: null,
};

export function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        case "tool/active":
            return {
                ...state,
                tool: action.payload,
            };

        case "style/active":
            return {
                ...state,
                activeStyle: {
                    ...state.activeStyle,
                    ...action.payload,
                },
            };

        case "save/possible":
            return {
                ...state,
                isSavePossible: action.payload,
            };
        case "save/confirm":
            return {
                ...state,
                isSaved: action.payload,
            };

        case "move/back":
            return {
                ...state,
                isBack: action.payload,
            };

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

        default:
            return state;
    }
}
