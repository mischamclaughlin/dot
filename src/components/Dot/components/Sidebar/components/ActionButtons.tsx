import type { ReactElement } from "react";

import type { DotStateProps } from "../../../state/DotStateProps";

import { initialRect } from "../../../state/DotReducer";

import stylesBtn from "../styles/Button.module.css";
// -----------------------------------------------------------------------------

export default function ActionButtons({
    state,
    dispatch,
}: DotStateProps): ReactElement {
    const disabledSave: boolean =
        state.canvasMode.mode !== "editing" ||
        state.canvasMode.element.area == initialRect;

    return (
        <div className={stylesBtn.buttonsContainer}>
            <button
                className={stylesBtn.btn}
                onClick={() =>
                    dispatch({
                        type: "canvasMode/back",
                    })
                }
            >
                back
            </button>
            <button
                className={stylesBtn.btn}
                onClick={() =>
                    dispatch({
                        type: "canvasMode/cancel",
                    })
                }
            >
                cancel
            </button>
            <button
                className={stylesBtn.btn}
                disabled={disabledSave}
                onClick={() => {}}
            >
                save
            </button>
        </div>
    );
}
