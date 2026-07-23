import { useEffect, useReducer } from "react";

import { initialState, reducer } from "./state/Reducer";

// import type { AreaStyle, CanvasTool } from "./types/DotGridTypes";

import Canvas from "./Canvas";
import Sidebar from "./Sidebar";

import styles from "./DotGrid.module.css";

export const MAX_WIDTH_RATIO = 0.85;
export const MIN_WIDTH = 185;

type DotGridProps = {
    onNotifications: (isSaved: boolean) => void;
};

export default function DotGrid({ onNotifications }: DotGridProps) {
    const [state, dispatch] = useReducer(reducer, initialState);

    // function handleSelectTool(tool: CanvasTool) {
    //     dispatch({
    //         type: "tool/selected",
    //         payload: tool,
    //     });
    // }

    // function handleSelectStyle(style: Partial<AreaStyle>) {
    //     dispatch({
    //         type: "style/active",
    //         payload: { ...style },
    //     });
    // }

    // function handleSaveElement(isSave: boolean) {
    //     dispatch({
    //         type: "save/saved",
    //         payload: isSave,
    //     });

    //     onNotifications(isSave);
    // }

    // function handleBack(isBack: boolean) {
    //     dispatch({
    //         type: "move/back",
    //         payload: isBack,
    //     });
    // }

    useEffect(() => {
        onNotifications(state.isSaved);
    });

    return (
        <div className={styles.container}>
            <Sidebar state={state} dispatch={dispatch} />
            <Canvas state={state} dispatch={dispatch} />
        </div>
    );
}
