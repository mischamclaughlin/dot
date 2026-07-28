import type { ReactElement } from "react";

import styles from "./_index.module.css";
import type { DotGridProps } from "../../types/DotGridProps";
// -----------------------------------------------------------------------------

export default function ToolSelectorButtons({
    state,
    dispatch,
}: DotGridProps): ReactElement {
    return (
        <div className={styles.controlContainer}>
            <button
                className={styles.button}
                onClick={() => {
                    if (state.mode.kind !== "area-selected") return;

                    dispatch({
                        type: "area/tool",
                        payload: state.mode.area,
                    });
                }}
            >
                Text
            </button>
            <button className={styles.button}>Coming soon.</button>
            <button className={styles.button}>Coming soon.</button>
            <button className={styles.button}>Coming soon.</button>
        </div>
    );
}
