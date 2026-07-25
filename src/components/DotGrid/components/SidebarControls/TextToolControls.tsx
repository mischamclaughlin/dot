import { useState, type Dispatch, type ReactElement } from "react";

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

import styles from "./TextToolControls.module.css";

type TextToolControlsProps = {
    state: State;
    dispatch: Dispatch<Action>;
};

export default function TextToolControls({
    state,
    dispatch,
}: TextToolControlsProps): ReactElement {
    const [heightJoined, setHeightJoined] = useState<boolean>(false);
    const [widthJoined, setWidthJoined] = useState<boolean>(false);
    const [allJoined, setAllJoined] = useState<boolean>(false);

    function matchesStyle(
        itemStyle: ItemStyle,
        optionStyle: Partial<ItemStyle>,
    ) {
        return Object.entries(optionStyle).every(
            ([proprety, value]) =>
                itemStyle[proprety as keyof ItemStyle] === value,
        );
    }

    function handleHeightJoined() {
        setHeightJoined((current) => !current);
    }

    function handleWidthJoined() {
        setWidthJoined((current) => !current);
    }

    function handleAllJoined() {
        setAllJoined((current) => !current);
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
            <div className={styles.controlContainer}>
                <div className={styles.rowContainer}>
                    {!allJoined && (
                        <div className={styles.controlContainer}>
                            <div className={styles.rowContainer}>
                                {!heightJoined && (
                                    <div className={styles.controlContainer}>
                                        <div className={styles.rowContainer}>
                                            <p className={styles.toolTitle}>
                                                T
                                            </p>
                                            <p className={styles.paddingAmount}>
                                                {state.itemStyle.paddingTop}
                                            </p>
                                            <button
                                                className={
                                                    styles.buttonCentered
                                                }
                                                onClick={() =>
                                                    dispatch({
                                                        type: "item/paddingTop",
                                                        payload: "down",
                                                    })
                                                }
                                            >
                                                -
                                            </button>
                                            <button
                                                className={
                                                    styles.buttonCentered
                                                }
                                                onClick={() =>
                                                    dispatch({
                                                        type: "item/paddingTop",
                                                        payload: "up",
                                                    })
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className={styles.rowContainer}>
                                            <p className={styles.toolTitle}>
                                                B
                                            </p>
                                            <p className={styles.paddingAmount}>
                                                {state.itemStyle.paddingBottom}
                                            </p>
                                            <button
                                                className={
                                                    styles.buttonCentered
                                                }
                                                onClick={() =>
                                                    dispatch({
                                                        type: "item/paddingBottom",
                                                        payload: "down",
                                                    })
                                                }
                                            >
                                                -
                                            </button>
                                            <button
                                                className={
                                                    styles.buttonCentered
                                                }
                                                onClick={() =>
                                                    dispatch({
                                                        type: "item/paddingBottom",
                                                        payload: "up",
                                                    })
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {heightJoined && (
                                    <div className={styles.rowContainer}>
                                        <div
                                            className={styles.controlContainer}
                                        >
                                            <div
                                                className={styles.rowContainer}
                                            >
                                                <p className={styles.toolTitle}>
                                                    T
                                                </p>
                                                <p
                                                    className={
                                                        styles.paddingAmount
                                                    }
                                                >
                                                    {state.itemStyle.paddingTop}
                                                </p>
                                            </div>
                                            <div
                                                className={styles.rowContainer}
                                            >
                                                <p className={styles.toolTitle}>
                                                    B
                                                </p>
                                                <p
                                                    className={
                                                        styles.paddingAmount
                                                    }
                                                >
                                                    {
                                                        state.itemStyle
                                                            .paddingBottom
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            className={styles.buttonCentered}
                                            onClick={() => {
                                                dispatch({
                                                    type: "item/paddingTop",
                                                    payload: "down",
                                                });
                                                dispatch({
                                                    type: "item/paddingBottom",
                                                    payload: "down",
                                                });
                                            }}
                                        >
                                            -
                                        </button>
                                        <button
                                            className={styles.buttonCentered}
                                            onClick={() => {
                                                dispatch({
                                                    type: "item/paddingTop",
                                                    payload: "up",
                                                });
                                                dispatch({
                                                    type: "item/paddingBottom",
                                                    payload: "up",
                                                });
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                )}
                                <button
                                    className={`${styles.buttonCentered} ${styles.buttonSmall} ${heightJoined ? styles.active : ""}`}
                                    onClick={handleHeightJoined}
                                >
                                    {"]"}
                                </button>
                            </div>
                            <div className={styles.rowContainer}>
                                {!widthJoined && (
                                    <div className={styles.controlContainer}>
                                        <div className={styles.rowContainer}>
                                            <p className={styles.toolTitle}>
                                                L
                                            </p>
                                            <p className={styles.paddingAmount}>
                                                {state.itemStyle.paddingLeft}
                                            </p>
                                            <button
                                                className={
                                                    styles.buttonCentered
                                                }
                                                onClick={() =>
                                                    dispatch({
                                                        type: "item/paddingLeft",
                                                        payload: "down",
                                                    })
                                                }
                                            >
                                                -
                                            </button>
                                            <button
                                                className={
                                                    styles.buttonCentered
                                                }
                                                onClick={() =>
                                                    dispatch({
                                                        type: "item/paddingLeft",
                                                        payload: "up",
                                                    })
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className={styles.rowContainer}>
                                            <p className={styles.toolTitle}>
                                                R
                                            </p>
                                            <p className={styles.paddingAmount}>
                                                {state.itemStyle.paddingRight}
                                            </p>
                                            <button
                                                className={
                                                    styles.buttonCentered
                                                }
                                                onClick={() =>
                                                    dispatch({
                                                        type: "item/paddingRight",
                                                        payload: "down",
                                                    })
                                                }
                                            >
                                                -
                                            </button>
                                            <button
                                                className={
                                                    styles.buttonCentered
                                                }
                                                onClick={() =>
                                                    dispatch({
                                                        type: "item/paddingRight",
                                                        payload: "up",
                                                    })
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {widthJoined && (
                                    <div className={styles.rowContainer}>
                                        <div
                                            className={styles.controlContainer}
                                        >
                                            <div
                                                className={styles.rowContainer}
                                            >
                                                <p className={styles.toolTitle}>
                                                    L
                                                </p>
                                                <p
                                                    className={
                                                        styles.paddingAmount
                                                    }
                                                >
                                                    {
                                                        state.itemStyle
                                                            .paddingLeft
                                                    }
                                                </p>
                                            </div>
                                            <div
                                                className={styles.rowContainer}
                                            >
                                                <p className={styles.toolTitle}>
                                                    R
                                                </p>
                                                <p
                                                    className={
                                                        styles.paddingAmount
                                                    }
                                                >
                                                    {
                                                        state.itemStyle
                                                            .paddingRight
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            className={styles.buttonCentered}
                                            onClick={() => {
                                                dispatch({
                                                    type: "item/paddingLeft",
                                                    payload: "down",
                                                });
                                                dispatch({
                                                    type: "item/paddingRight",
                                                    payload: "down",
                                                });
                                            }}
                                        >
                                            -
                                        </button>
                                        <button
                                            className={styles.buttonCentered}
                                            onClick={() => {
                                                dispatch({
                                                    type: "item/paddingLeft",
                                                    payload: "up",
                                                });
                                                dispatch({
                                                    type: "item/paddingRight",
                                                    payload: "up",
                                                });
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                )}
                                <button
                                    className={`${styles.buttonCentered} ${styles.buttonSmall} ${widthJoined ? styles.active : ""}`}
                                    onClick={handleWidthJoined}
                                >
                                    {"]"}
                                </button>
                            </div>
                        </div>
                    )}
                    {allJoined && (
                        <div className={styles.controlContainer}>
                            <div className={styles.rowContainer}>
                                <div className={styles.controlContainer}>
                                    <div className={styles.rowContainer}>
                                        <p className={styles.toolTitle}>T</p>
                                        <p className={styles.paddingAmount}>
                                            {state.itemStyle.paddingTop}
                                        </p>
                                    </div>
                                    <div className={styles.rowContainer}>
                                        <p className={styles.toolTitle}>B</p>
                                        <p className={styles.paddingAmount}>
                                            {state.itemStyle.paddingBottom}
                                        </p>
                                    </div>
                                    <div className={styles.rowContainer}>
                                        <p className={styles.toolTitle}>L</p>
                                        <p className={styles.paddingAmount}>
                                            {state.itemStyle.paddingLeft}
                                        </p>
                                    </div>
                                    <div className={styles.rowContainer}>
                                        <p className={styles.toolTitle}>R</p>
                                        <p className={styles.paddingAmount}>
                                            {state.itemStyle.paddingRight}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    className={styles.buttonCentered}
                                    onClick={() => {
                                        dispatch({
                                            type: "item/paddingTop",
                                            payload: "down",
                                        });
                                        dispatch({
                                            type: "item/paddingBottom",
                                            payload: "down",
                                        });
                                        dispatch({
                                            type: "item/paddingLeft",
                                            payload: "down",
                                        });
                                        dispatch({
                                            type: "item/paddingRight",
                                            payload: "down",
                                        });
                                    }}
                                >
                                    -
                                </button>
                                <button
                                    className={styles.buttonCentered}
                                    onClick={() => {
                                        dispatch({
                                            type: "item/paddingTop",
                                            payload: "up",
                                        });
                                        dispatch({
                                            type: "item/paddingBottom",
                                            payload: "up",
                                        });
                                        dispatch({
                                            type: "item/paddingLeft",
                                            payload: "up",
                                        });
                                        dispatch({
                                            type: "item/paddingRight",
                                            payload: "up",
                                        });
                                    }}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    )}
                    <button
                        className={`${styles.buttonCentered} ${styles.buttonSmall} ${allJoined ? styles.active : ""}`}
                        onClick={handleAllJoined}
                    >
                        {"]"}
                    </button>
                </div>
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
