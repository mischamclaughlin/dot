import type { Dispatch, ReactElement } from "react";
import type { DotState } from "../../../model/DotDocumentState";

import { initialRect, type Action } from "../../../state/DotReducer";

import styles from "../Sidebar.module.css";
import stylesBtn from "../styles/Button.module.css";
// -----------------------------------------------------------------------------

type ActionButtonsProps = {
    state: DotState;
    dispatch: Dispatch<Action>;
};

export default function ActionButtons({
    state,
    dispatch,
}: ActionButtonsProps): ReactElement {
    const disabledSave: boolean =
        state.canvasMode.mode !== "editing" ||
        state.canvasMode.element.area == initialRect;

    return (
        <div className={styles.optionContainer}>
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
