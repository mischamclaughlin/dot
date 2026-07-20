import { type ReactElement } from "react";

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
    activeStyle: AreaStyle;
    onSelectStyle: (style: Partial<AreaStyle>) => void;
};

export default function TextToolControls({
    activeStyle,
    onSelectStyle,
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
                        ${matchesStyle(activeStyle, variantTitle) ? styles.active : ""}
                        `}
                    onClick={() => onSelectStyle(variantTitle)}
                >
                    Title
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(activeStyle, variantSubTitle) ? styles.active : ""}
                        `}
                    onClick={() => onSelectStyle(variantSubTitle)}
                >
                    Subtitle
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(activeStyle, variantHeading) ? styles.active : ""}
                        `}
                    onClick={() => onSelectStyle(variantHeading)}
                >
                    Heading
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(activeStyle, variantSubHeading) ? styles.active : ""}
                        `}
                    onClick={() => onSelectStyle(variantSubHeading)}
                >
                    Subheading
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(activeStyle, variantBody) ? styles.active : ""}
                        `}
                    onClick={() => onSelectStyle(variantBody)}
                >
                    Body
                </button>
            </div>
            <div className={styles.controlContainer}>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(activeStyle, textAlignLeft) ? styles.active : ""}
                        `}
                    onClick={() => onSelectStyle(textAlignLeft)}
                >
                    Left
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(activeStyle, textAlignRight) ? styles.active : ""}
                        `}
                    onClick={() => onSelectStyle(textAlignRight)}
                >
                    Right
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(activeStyle, textAlignCenter) ? styles.active : ""}
                        `}
                    onClick={() => onSelectStyle(textAlignCenter)}
                >
                    Center
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(activeStyle, textAlignJustify) ? styles.active : ""}
                        `}
                    onClick={() => onSelectStyle(textAlignJustify)}
                >
                    Justify
                </button>
            </div>
            <div className={styles.controlContainer}>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(activeStyle, contentAlignStart) ? styles.active : ""}
                        `}
                    onClick={() => onSelectStyle(contentAlignStart)}
                >
                    Start
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(activeStyle, contentAlignCenter) ? styles.active : ""}
                        `}
                    onClick={() => onSelectStyle(contentAlignCenter)}
                >
                    Center
                </button>
                <button
                    className={`
                        ${styles.button}
                        ${matchesStyle(activeStyle, contentAlignEnd) ? styles.active : ""}
                        `}
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
                        value={
                            activeStyle.color ?? defaultForegroundColour.color
                        }
                        onChange={(e) => {
                            onSelectStyle({ color: e.target.value });
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
                        value={
                            activeStyle.backgroundColor ??
                            defaultBackgroundColour.backgroundColor
                        }
                        onChange={(e) => {
                            onSelectStyle({ backgroundColor: e.target.value });
                        }}
                    />
                </div>
            </div>
        </>
    );
}
