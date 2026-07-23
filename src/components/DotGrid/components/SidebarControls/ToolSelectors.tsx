import type { Dispatch, ReactElement } from "react";

import type { Action } from "../../state/DotGridReducer";

import styles from "./ToolSelectors.module.css";

type ToolSelectorsProps = { dispatch: Dispatch<Action> };

export default function ToolSelectors({
    dispatch,
}: ToolSelectorsProps): ReactElement {
    return (
        <div className={styles.controlContainer}>
            <button
                className={styles.button}
                onClick={() =>
                    dispatch({
                        type: "tool/selected",
                        payload: "text",
                    })
                }
            >
                Text
            </button>
            <button
                className={styles.button}
                onClick={() =>
                    dispatch({
                        type: "tool/selected",
                        payload: "image",
                    })
                }
            >
                Coming soon.
            </button>
            <button
                className={styles.button}
                onClick={() =>
                    dispatch({
                        type: "tool/selected",
                        payload: "component",
                    })
                }
            >
                Coming soon.
            </button>
            <button
                className={styles.button}
                onClick={() =>
                    dispatch({
                        type: "tool/selected",
                        payload: "describe",
                    })
                }
            >
                Coming soon.
            </button>
        </div>
    );
}
