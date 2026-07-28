import type { ReactElement } from "react";

import type { DotGridProps } from "../../../../types/DotGridProps";

import styles from "./_index.module.css";
import { initialStyle } from "../../../../state/SquareDotReducer";
// -----------------------------------------------------------------------------

export default function ColourPickerButtons({
    state,
    dispatch,
}: DotGridProps): ReactElement {
    if (state.selectedTool !== "text") return <></>;

    const currentStyle =
        state.mode.kind === "editing"
            ? state.mode.draft.style
            : initialStyle;

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
                    value={currentStyle.colourForeground}
                    onChange={(e) =>
                        dispatch({
                            type: "item/style",
                            payload: { colourForeground: e.target.value },
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
                    value={currentStyle.colourBackground}
                    onChange={(e) =>
                        dispatch({
                            type: "item/style",
                            payload: { colourBackground: e.target.value },
                        })
                    }
                />
            </div>
        </div>
    );
}
