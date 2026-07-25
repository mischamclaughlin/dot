import type { ReactElement } from "react";
import { useState } from "react";

import type { DotGridProps } from "../../../../types/DotGridProps";

import styles from "./PaddingButtons.module.css";
// -----------------------------------------------------------------------------

export default function PaddingButtons({
    state,
    dispatch,
}: DotGridProps): ReactElement {
    const [heightJoined, setHeightJoined] = useState<boolean>(false);
    const [widthJoined, setWidthJoined] = useState<boolean>(false);
    const [allJoined, setAllJoined] = useState<boolean>(false);

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
        <div className={styles.controlContainer}>
            <div className={styles.rowContainer}>
                {!allJoined && (
                    <div className={styles.controlContainer}>
                        <div className={styles.rowContainer}>
                            {!heightJoined && (
                                <div className={styles.controlContainer}>
                                    <div className={styles.rowContainer}>
                                        <p className={styles.toolTitle}>T</p>
                                        <p className={styles.paddingAmount}>
                                            {state.itemStyle.paddingTop}
                                        </p>
                                        <button
                                            className={styles.buttonCentered}
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
                                            className={styles.buttonCentered}
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
                                        <p className={styles.toolTitle}>B</p>
                                        <p className={styles.paddingAmount}>
                                            {state.itemStyle.paddingBottom}
                                        </p>
                                        <button
                                            className={styles.buttonCentered}
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
                                            className={styles.buttonCentered}
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
                                    <div className={styles.controlContainer}>
                                        <div className={styles.rowContainer}>
                                            <p className={styles.toolTitle}>
                                                T
                                            </p>
                                            <p className={styles.paddingAmount}>
                                                {state.itemStyle.paddingTop}
                                            </p>
                                        </div>
                                        <div className={styles.rowContainer}>
                                            <p className={styles.toolTitle}>
                                                B
                                            </p>
                                            <p className={styles.paddingAmount}>
                                                {state.itemStyle.paddingBottom}
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
                                        <p className={styles.toolTitle}>L</p>
                                        <p className={styles.paddingAmount}>
                                            {state.itemStyle.paddingLeft}
                                        </p>
                                        <button
                                            className={styles.buttonCentered}
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
                                            className={styles.buttonCentered}
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
                                        <p className={styles.toolTitle}>R</p>
                                        <p className={styles.paddingAmount}>
                                            {state.itemStyle.paddingRight}
                                        </p>
                                        <button
                                            className={styles.buttonCentered}
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
                                            className={styles.buttonCentered}
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
                                    <div className={styles.controlContainer}>
                                        <div className={styles.rowContainer}>
                                            <p className={styles.toolTitle}>
                                                L
                                            </p>
                                            <p className={styles.paddingAmount}>
                                                {state.itemStyle.paddingLeft}
                                            </p>
                                        </div>
                                        <div className={styles.rowContainer}>
                                            <p className={styles.toolTitle}>
                                                R
                                            </p>
                                            <p className={styles.paddingAmount}>
                                                {state.itemStyle.paddingRight}
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
                    className={`
                        ${styles.buttonCentered}
                        ${styles.buttonSmall}
                        ${allJoined ? styles.active : ""}
                        `}
                    onClick={handleAllJoined}
                >
                    {"]"}
                </button>
            </div>
        </div>
    );
}
