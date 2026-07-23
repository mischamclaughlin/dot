import { type Dispatch, type ReactElement } from "react";

import type { AreaStyle } from "../../types/DotGridTypes";

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

import styles from "./TextToolControls.module.css";
import type { Action, State } from "../../state/Reducer";

type TextToolControlsProps = {
    state: State;
    dispatch: Dispatch<Action>;
};

export default function TextToolControls({
    state,
    dispatch,
}: TextToolControlsProps): ReactElement {
    function matchesStyle(
        activeStyle: AreaStyle,
        optionStyle: Partial<AreaStyle>,
    ) {
        return Object.entries(optionStyle).every(
            ([proprety, value]) =>
                activeStyle[proprety as keyof AreaStyle] === value,
        );
    }

    return (
        <>
            <div className={styles.controlContainer}>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(state.activeStyle, variantTitle) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "style/active",
                            payload: { ...variantTitle },
                        })
                    }
                >
                    Title
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(state.activeStyle, variantSubTitle) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "style/active",
                            payload: { ...variantSubTitle },
                        })
                    }
                >
                    Subtitle
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(state.activeStyle, variantHeading) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "style/active",
                            payload: { ...variantHeading },
                        })
                    }
                >
                    Heading
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(state.activeStyle, variantSubHeading) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "style/active",
                            payload: { ...variantSubHeading },
                        })
                    }
                >
                    Subheading
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(state.activeStyle, variantBody) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "style/active",
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
                        ${matchesStyle(state.activeStyle, textAlignLeft) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "style/active",
                            payload: { ...textAlignLeft },
                        })
                    }
                >
                    Left
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(state.activeStyle, textAlignRight) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "style/active",
                            payload: { ...textAlignRight },
                        })
                    }
                >
                    Right
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(state.activeStyle, textAlignCenter) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "style/active",
                            payload: { ...textAlignCenter },
                        })
                    }
                >
                    Center
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(state.activeStyle, textAlignJustify) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "style/active",
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
                        ${matchesStyle(state.activeStyle, contentAlignStart) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "style/active",
                            payload: { ...contentAlignStart },
                        })
                    }
                >
                    Start
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(state.activeStyle, contentAlignCenter) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "style/active",
                            payload: { ...contentAlignCenter },
                        })
                    }
                >
                    Center
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(state.activeStyle, contentAlignEnd) ? styles.active : ""}
                        `}
                    onClick={() =>
                        dispatch({
                            type: "style/active",
                            payload: { ...contentAlignEnd },
                        })
                    }
                >
                    End
                </button>
            </div>
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
                            state.activeStyle.color ??
                            defaultForegroundColour.color
                        }
                        onChange={(e) =>
                            dispatch({
                                type: "style/active",
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
                            state.activeStyle.backgroundColor ??
                            defaultBackgroundColour.backgroundColor
                        }
                        onChange={(e) =>
                            dispatch({
                                type: "style/active",
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
