import type { ReactElement } from "react";

import type { DotGridProps } from "../../../../types/DotGridProps";

import {
    contentAlignCenter,
    contentAlignEnd,
    contentAlignStart,
    textAlignCenter,
    textAlignJustify,
    textAlignLeft,
    textAlignRight,
} from "../../../../tool/TextTool/TextStyles";
import { matchesStyle } from "./shared/helpers";

import styles from "./_index.module.css";
import { initialStyle } from "../../../../state/SquareDotReducer";
// -----------------------------------------------------------------------------

export default function AlignButtons({
    state,
    dispatch,
}: DotGridProps): ReactElement {
    if (state.selectedTool !== "text") return <></>;

    const currentStyle =
        state.mode.kind === "editing" ? state.mode.draft.style : initialStyle;

    return (
        <>
            <div className={styles.controlContainer}>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(currentStyle, textAlignLeft) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "item/style",
                            payload: { alignText: "left" },
                        })
                    }
                >
                    Left
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(currentStyle, textAlignRight) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "item/style",
                            payload: { alignText: "right" },
                        })
                    }
                >
                    Right
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(currentStyle, textAlignCenter) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "item/style",
                            payload: { alignText: "center" },
                        })
                    }
                >
                    Center
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(currentStyle, textAlignJustify) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "item/style",
                            payload: { alignText: "justify" },
                        })
                    }
                >
                    Justify
                </button>
            </div>
            <div className={styles.controlContainer}>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(currentStyle, contentAlignStart) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "item/style",
                            payload: { alignContent: "start" },
                        })
                    }
                >
                    Start
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(currentStyle, contentAlignCenter) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "item/style",
                            payload: { alignContent: "center" },
                        })
                    }
                >
                    Center
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(currentStyle, contentAlignEnd) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "item/style",
                            payload: { alignContent: "end" },
                        })
                    }
                >
                    End
                </button>
            </div>
        </>
    );
}
