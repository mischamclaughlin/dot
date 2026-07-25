import { type Dispatch, type ReactElement } from "react";

import type { Action, State } from "../../state/DotGridReducer";
import type { ItemStyle } from "../../types/DotGridTypes";

import {
    contentAlignCenter,
    contentAlignEnd,
    contentAlignStart,
    defaultBackgroundColour,
    defaultForegroundColour,
    textAlignCenter,
    textAlignJustify,
    textAlignLeft,
    textAlignRight,
    variantBody,
    variantHeading,
    variantSubHeading,
    variantSubTitle,
    variantTitle,
} from "../../styles/DotGridStyles";

import PaddingButtons from "./component/TextTool/PaddingButtons";

import styles from "./TextToolButtons.module.css";

type TextToolControlsProps = {
    state: State;
    dispatch: Dispatch<Action>;
};

export default function TextToolButtons({
    state,
    dispatch,
}: TextToolControlsProps): ReactElement {
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
                        ${matchesStyle(state.itemStyle, variantTitle) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "item/style",
                            payload: { ...variantTitle },
                        })
                    }
                >
                    Title
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(state.itemStyle, variantSubTitle) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "item/style",
                            payload: { ...variantSubTitle },
                        })
                    }
                >
                    Subtitle
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(state.itemStyle, variantHeading) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "item/style",
                            payload: { ...variantHeading },
                        })
                    }
                >
                    Heading
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(state.itemStyle, variantSubHeading) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "item/style",
                            payload: { ...variantSubHeading },
                        })
                    }
                >
                    Subheading
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(state.itemStyle, variantBody) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "item/style",
                            payload: { ...variantBody },
                        })
                    }
                >
                    Body
                </button>
            </div>
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

            <PaddingButtons state={state} dispatch={dispatch} />

            <div className={styles.controlContainer}>
                <div className={styles.colourPicker}>
                    <label className={styles.button} htmlFor="foregroundColour">
                        Foreground
                    </label>
                    <input
                        type="color"
                        id="foregroundColour"
                        name="foregroundColour"
                        value={
                            state.itemStyle.color ??
                            defaultForegroundColour.color
                        }
                        onChange={(e) =>
                            dispatch({
                                type: "item/style",
                                payload: { ...{ color: e.target.value } },
                            })
                        }
                    />
                </div>
                <div className={styles.colourPicker}>
                    <label className={styles.button} htmlFor="backgroundColour">
                        Background
                    </label>
                    <input
                        type="color"
                        id="backgroundColour"
                        name="backgroundColour"
                        value={
                            state.itemStyle.backgroundColor ??
                            defaultBackgroundColour.backgroundColor
                        }
                        onChange={(e) =>
                            dispatch({
                                type: "item/style",
                                payload: {
                                    ...{ backgroundColor: e.target.value },
                                },
                            })
                        }
                    />
                </div>
            </div>
        </>
    );
}
