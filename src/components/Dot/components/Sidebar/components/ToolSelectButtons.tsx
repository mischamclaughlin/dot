import type { ReactElement } from "react";

import type { DotStateProps } from "../../../state/DotStateProps";

import stylesBtn from "../styles/Button.module.css";
// -----------------------------------------------------------------------------

export default function ToolSelectButtons({
    state,
    dispatch,
}: DotStateProps): ReactElement {
    function handleToolSelect() {
        if (state.canvasMode.mode === "idle") {
            dispatch({
                type: "canvasMode/switch",
                payload: {
                    toolType: "text",
                    area: null,
                },
            });
        }

        if (state.canvasMode.mode === "drawing") {
            dispatch({
                type: "canvasMode/switch",
                payload: {
                    toolType: "text",
                    area: state.canvasMode.session.element.area,
                },
            });
        }
    }

    return (
        <>
            <div className={stylesBtn.buttonsContainer}>
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
