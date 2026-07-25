import type { ReactElement } from "react";

import type { DotGridProps } from "../../../../types/DotGridProps";

import {
    defaultBackgroundColour,
    defaultForegroundColour,
} from "../../../../tool/TextTool/TextStyles";

import styles from "./_index.module.css";
// -----------------------------------------------------------------------------

export default function ColourPickerButtons({
    state,
    dispatch,
}: DotGridProps): ReactElement {
    return (
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
                        state.itemStyle.color ?? defaultForegroundColour.color
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
    );
}
