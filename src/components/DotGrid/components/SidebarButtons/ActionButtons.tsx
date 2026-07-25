import type { Dispatch, ReactElement } from "react";

import type { Action, State } from "../../state/DotGridReducer";

import styles from "./ActionButtons.module.css";

type ToolActionsProps = { state: State; dispatch: Dispatch<Action> };

export default function ActionButtons({
    state,
    dispatch,
}: ToolActionsProps): ReactElement {
    return (
        <div className={styles.controlContainer}>
            <button
                className={styles.button}
                onClick={() => dispatch({ type: "editing/back" })}
            >
                Back
            </button>
            <button
                className={styles.button}
                disabled={!state.toolArea}
                onClick={() =>
                    dispatch({
                        type: "item/save",
                        payload: crypto.randomUUID(),
                    })
                }
            >
                Save
            </button>
        </div>
    );
}
