import type { Dispatch, ReactElement } from "react";

import styles from "./ToolSelectors.module.css";
import type { Action } from "../../state/Reducer";

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
                        type: "tool/active",
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
                        type: "tool/active",
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
                        type: "tool/active",
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
                        type: "tool/active",
                        payload: "describe",
                    })
                }
            >
                Coming soon.
            </button>
        </div>
    );
}
