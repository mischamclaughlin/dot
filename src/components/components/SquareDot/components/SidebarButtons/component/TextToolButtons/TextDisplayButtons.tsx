import type { ReactElement } from "react";

import type { DotGridProps } from "../../../../types/DotGridProps";

import {
    variantBody,
    variantHeading,
    variantSubHeading,
    variantSubTitle,
    variantTitle,
} from "../../../../tool/TextTool/TextStyles";
import { matchesStyle } from "./shared/helpers";

import styles from "./_index.module.css";
// -----------------------------------------------------------------------------

export default function TextDisplayButtons({
    state,
    dispatch,
}: DotGridProps): ReactElement {
    if (state.mode.kind !== "editing") return <></>;

    return (
        <div className={styles.controlContainer}>
            <button
                className={`
                ${styles.button}
                ${matchesStyle(state.mode.draft.style, variantTitle) ? styles.active : ""}
                `}
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
                className={`
                ${styles.button}
                ${matchesStyle(state.mode.draft.style, variantSubTitle) ? styles.active : ""}
                `}
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
                className={`
                ${styles.button}
                ${matchesStyle(state.mode.draft.style, variantHeading) ? styles.active : ""}
                `}
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
                className={`
                ${styles.button}
                ${matchesStyle(state.mode.draft.style, variantSubHeading) ? styles.active : ""}
                `}
                onClick={() =>
                    dispatch({
                        type: "item/style",
                        payload: { fontSize: 1, fontWeight: 450 },
                    })
                }
            >
                Subheading
            </button>
            <button
                className={`
                ${styles.button}
                ${matchesStyle(state.mode.draft.style, variantBody) ? styles.active : ""}
                `}
                onClick={() =>
                    dispatch({
                        type: "item/style",
                        payload: { fontSize: 1, fontWeight: 400 },
                    })
                }
            >
                Body
            </button>
        </div>
    );
}
