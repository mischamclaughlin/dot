import type { ReactElement } from "react";

import type { DotGridProps } from "../../../../types/DotGridProps";
import type { ItemStyle } from "../../../../types/DotGridTypes";

import {
    variantBody,
    variantHeading,
    variantSubHeading,
    variantSubTitle,
    variantTitle,
} from "../../../../styles/DotGridStyles";

import styles from "../../TextToolButtons.module.css";
// -----------------------------------------------------------------------------

export default function TextDisplayButtons({
    state,
    dispatch,
}: DotGridProps): ReactElement {
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
    );
}
