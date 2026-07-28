import type { ReactElement } from "react";

import type { DotGridProps } from "../../../../types/DotGridProps";

import {
    variantBody,
    variantHeading,
    variantSubHeading,
    variantSubtitle,
    variantTitle,
} from "../../../../tool/TextTool/TextStyles";
import { matchesStyle } from "./shared/helpers";

import styles from "./_index.module.css";
import { initialStyle } from "../../../../state/SquareDotReducer";
// -----------------------------------------------------------------------------

export default function TextDisplayButtons({
    state,
    dispatch,
}: DotGridProps): ReactElement {
    if (state.selectedTool !== "text") return <></>;

    const currentStyle =
        state.mode.kind === "editing" ? state.mode.draft.style : initialStyle;

    return (
        <div className={styles.controlContainer}>
            <button
                className={`${styles.button} ${matchesStyle(currentStyle, variantTitle) ? styles.active : ""}`}
                onClick={() =>
                    dispatch({
                        type: "item/style",
                        payload: { fontSize: 2, fontWeight: 700 },
                    })
                }
            >
                Title
            </button>
            <button
                className={`${styles.button} ${matchesStyle(currentStyle, variantSubtitle) ? styles.active : ""}`}
                onClick={() =>
                    dispatch({
                        type: "item/style",
                        payload: { fontSize: 1.17, fontWeight: 500 },
                    })
                }
            >
                Subtitle
            </button>
            <button
                className={`${styles.button} ${matchesStyle(currentStyle, variantHeading) ? styles.active : ""}`}
                onClick={() =>
                    dispatch({
                        type: "item/style",
                        payload: { fontSize: 1.5, fontWeight: 600 },
                    })
                }
            >
                Heading
            </button>
            <button
                className={`${styles.button} ${matchesStyle(currentStyle, variantSubHeading) ? styles.active : ""}`}
                onClick={() =>
                    dispatch({
                        type: "item/style",
                        payload: { fontSize: 1, fontWeight: 500 },
                    })
                }
            >
                Subheading
            </button>
            <button
                className={`${styles.button} ${matchesStyle(currentStyle, variantBody) ? styles.active : ""}`}
                onClick={() =>
                    dispatch({
                        type: "item/style",
                        payload: { fontSize: 1, fontWeight: 300 },
                    })
                }
            >
                Body
            </button>
        </div>
    );
}
