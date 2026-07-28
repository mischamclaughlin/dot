import type { ReactElement } from "react";

import styles from "./_index.module.css";
import type { DotGridProps } from "../../types/DotGridProps";
// -----------------------------------------------------------------------------



export default function ToolSelectorButtons({
    dispatch,
}: DotGridProps): ReactElement {
    return (
        <div className={styles.controlContainer}>
            <button
                className={styles.button}
                onClick={() => {
                    dispatch({
                        type: "tool/selected",
                        payload: "text",
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
