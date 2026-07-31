import type { ReactElement } from "react";

import type { DotStateProps } from "../../../state/DotStateProps";

import stylesBtn from "../styles/Button.module.css";
// -----------------------------------------------------------------------------

export default function ActionButtons({
    state,
    dispatch,
}: DotStateProps): ReactElement {
    return (
        <div className={stylesBtn.buttonsContainer}>
            <button
                className={stylesBtn.btn}
                onClick={() =>
                    dispatch({
                        type: "action/back",
                    })
                }
            >
                back
            </button>
            <button
                className={stylesBtn.btn}
                onClick={() =>
                    dispatch({
                        type: "action/cancel",
                    })
                }
            >
                cancel
            </button>
            <button
                type="submit"
                form="text-edit-form"
                className={stylesBtn.btn}
                disabled={
                    state.canvasMode.mode !== "editing" ||
                    !state.canvasMode.session.element.area
                }
            >
                save
            </button>
        </div>
    );
}
