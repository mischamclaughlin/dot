import type { ReactElement } from "react";

import type { DotGridProps } from "../../../../types/DotGridProps";
import type { ItemStyle } from "../../../../types/DotGridTypes";

import {
    contentAlignCenter,
    contentAlignEnd,
    contentAlignStart,
    textAlignCenter,
    textAlignJustify,
    textAlignLeft,
    textAlignRight,
} from "../../../../styles/DotGridStyles";

import styles from "../../TextToolButtons.module.css";
// -----------------------------------------------------------------------------

export default function AlignButtons({
    state,
    dispatch,
}: DotGridProps): ReactElement {
    function matchesStyle(
        itemStyle: ItemStyle,
        optionStyle: Partial<ItemStyle>,
    ) {
        return Object.entries(optionStyle).every(
            ([proprety, value]) =>
                itemStyle[proprety as keyof ItemStyle] === value,
        );
    }

    return (
        <>
            <div className={styles.controlContainer}>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(state.itemStyle, textAlignLeft) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "item/style",
                            payload: { ...textAlignLeft },
                        })
                    }
                >
                    Left
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(state.itemStyle, textAlignRight) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "item/style",
                            payload: { ...textAlignRight },
                        })
                    }
                >
                    Right
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(state.itemStyle, textAlignCenter) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "item/style",
                            payload: { ...textAlignCenter },
                        })
                    }
                >
                    Center
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(state.itemStyle, textAlignJustify) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "item/style",
                            payload: { ...textAlignJustify },
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
                        ${matchesStyle(state.itemStyle, contentAlignStart) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "item/style",
                            payload: { ...contentAlignStart },
                        })
                    }
                >
                    Start
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(state.itemStyle, contentAlignCenter) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "item/style",
                            payload: { ...contentAlignCenter },
                        })
                    }
                >
                    Center
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(state.itemStyle, contentAlignEnd) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "item/style",
                            payload: { ...contentAlignEnd },
                        })
                    }
                >
                    End
                </button>
            </div>
        </>
    );
}
