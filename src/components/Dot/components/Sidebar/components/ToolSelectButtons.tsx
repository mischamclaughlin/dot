import type { Dispatch, ReactElement } from "react";

import type { DotState } from "../../../model/DotDocumentState";
import type { Action } from "../../../state/DotReducer";

import { initialRect } from "../../../state/DotReducer";

import stylesBtn from "../styles/Button.module.css";
import styles from "../Sidebar.module.css";
// -----------------------------------------------------------------------------

type ToolSelectButtonsProps = {
    state: DotState;
    dispatch: Dispatch<Action>;
};

export default function ToolSelectButtons({
    state,
    dispatch,
}: ToolSelectButtonsProps): ReactElement {
    function handleToolSelect() {
        if (state.canvasMode.mode === "idle") {
            dispatch({
                type: "canvasMode/switch",
                payload: {
                    toolType: "text",
                    area: initialRect,
                },
            });
        }

        if (state.canvasMode.mode === "drawing") {
            dispatch({
                type: "canvasMode/switch",
                payload: {
                    toolType: "text",
                    area: state.canvasMode.area,
                },
            });
        }
    }

    return (
        <>
            <div className={styles.optionContainer}>
                <button className={stylesBtn.btn} onClick={handleToolSelect}>
                    text
                </button>
                <button className={stylesBtn.btn}>coming soon.</button>
                <button className={stylesBtn.btn}>coming soon.</button>
                <button className={stylesBtn.btn}>coming soon.</button>
            </div>
        </>
    );
}
