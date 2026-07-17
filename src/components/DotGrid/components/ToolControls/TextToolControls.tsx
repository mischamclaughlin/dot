import { useState, type CSSProperties, type ReactElement } from "react";

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

type TextToolControlsProps = {
    onSelectStyle: (style: AreaStyle) => void;
};

export default function TextToolControls({
    onSelectStyle,
}: TextToolControlsProps): ReactElement {
    const [backgroundColour, setBackgroundColour] = useState<CSSProperties>(
        defaultBackgroundColour,
    );
    const [foregroundColour, setForegroundColour] = useState<CSSProperties>(
        defaultForegroundColour,
    );

    function handleForegroundColourChange(
        e: React.ChangeEvent<HTMLInputElement>,
    ) {
        const nextColour = {
            color: e.target.value,
        } satisfies AreaStyle;

        setForegroundColour(nextColour);
        onSelectStyle(nextColour);
    }

    function handleBackgroundColourChange(
        e: React.ChangeEvent<HTMLInputElement>,
    ) {
        const nextColour = {
            backgroundColor: e.target.value,
        } satisfies AreaStyle;

        setBackgroundColour(nextColour);
        onSelectStyle(nextColour);
    }

    return (
        <>
            <div className={styles.controlContainer}>
                <button
                    className={styles.button}
                    onClick={() => onSelectStyle(variantTitle)}
                >
                    Title
                </button>
                <button
                    className={styles.button}
                    onClick={() => onSelectStyle(variantSubTitle)}
                >
                    Subtitle
                </button>
                <button
                    className={styles.button}
                    onClick={() => onSelectStyle(variantHeading)}
                >
                    Heading
                </button>
                <button
                    className={styles.button}
                    onClick={() => onSelectStyle(variantSubHeading)}
                >
                    Subheading
                </button>
                <button
                    className={styles.button}
                    onClick={() => onSelectStyle(variantBody)}
                >
                    Body
                </button>
            </div>
            <div className={styles.controlContainer}>
                <button
                    className={styles.button}
                    onClick={() => onSelectStyle(textAlignLeft)}
                >
                    Left
                </button>
                <button
                    className={styles.button}
                    onClick={() => onSelectStyle(textAlignRight)}
                >
                    Right
                </button>
                <button
                    className={styles.button}
                    onClick={() => onSelectStyle(textAlignCenter)}
                >
                    Center
                </button>
                <button
                    className={styles.button}
                    onClick={() => onSelectStyle(textAlignJustify)}
                >
                    Justify
                </button>
            </div>
            <div className={styles.controlContainer}>
                <button
                    className={styles.button}
                    onClick={() => onSelectStyle(contentAlignStart)}
                >
                    Start
                </button>
                <button
                    className={styles.button}
                    onClick={() => onSelectStyle(contentAlignCenter)}
                >
                    Center
                </button>
                <button
                    className={styles.button}
                    onClick={() => onSelectStyle(contentAlignEnd)}
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
                        value={foregroundColour.color}
                        onChange={(e) => {
                            handleForegroundColourChange(e);
                        }}
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
                        value={backgroundColour.backgroundColor}
                        onChange={(e) => {
                            handleBackgroundColourChange(e);
                        }}
                    />
                </div>
            </div>
        </>
    );
}
