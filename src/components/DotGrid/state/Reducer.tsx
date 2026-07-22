import { defaultStyle } from "../styles/DotGridStyles";
import type { AreaStyle, CanvasTool } from "../types/DotGridTypes";

export type State = {
    tool: CanvasTool;
    activeStyle: AreaStyle;
    isSaveValid: boolean;
    isSaved: boolean;
    isBack: boolean;
};

export type Action =
    | { type: "tool/selected"; payload: CanvasTool }
    | { type: "style/active"; payload: Partial<AreaStyle> }
    | { type: "save/valid"; payload: boolean }
    | { type: "save/saved"; payload: boolean }
    | { type: "move/back"; payload: boolean };

export const initialState: State = {
    tool: null,
    activeStyle: defaultStyle,
    isSaveValid: false,
    isSaved: false,
    isBack: false,
};

export function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        case "tool/selected":
            return {
                ...state,
                tool: action.payload,
                isSaveValid: false,
            };

        case "style/active":
            return {
                ...state,
                activeStyle: {
                    ...state.activeStyle,
                    ...action.payload,
                },
            };

        case "save/valid":
            return {
                ...state,
                isSaveValid: action.payload,
            };
        case "save/saved":
            return {
                ...state,
                isSaved: action.payload,
                isSaveValid: false,
            };

        case "move/back":
            return {
                ...state,
                isBack: action.payload,
                isSaveValid: false,
            };

        default:
            return state;
    }
}
