import type { ReactElement } from "react";

import type { DotGridProps } from "../../types/DotGridProps";

import styles from "./_index.module.css";
// -----------------------------------------------------------------------------

export default function ActionButtons({
    state,
    dispatch,
}: DotGridProps): ReactElement {
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
                disabled={state.mode.kind !== "editing"}
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
