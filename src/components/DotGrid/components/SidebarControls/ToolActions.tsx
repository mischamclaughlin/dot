import type { Dispatch, ReactElement } from "react";

import styles from "./ToolActions.module.css";
import type { Action, State } from "../../state/Reducer";

type ToolActionsProps = { state: State; dispatch: Dispatch<Action> };

export default function ToolActions({
    state,
    dispatch,
}: ToolActionsProps): ReactElement {
    return (
        <div className={styles.controlContainer}>
            <button
                className={styles.button}
                onClick={() =>
                    dispatch({
                        type: "move/back",
                        payload: true,
                    })
                }
            >
                Back
            </button>
            <button
                className={styles.button}
                disabled={!state.toolArea}
                onClick={() =>
                    dispatch({
                        type: "save/confirm",
                        payload: true,
                    })
                }
            >
                Save
            </button>
        </div>
    );
}
