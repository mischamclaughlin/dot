import type { ReactElement } from "react";

import type { CanvasElement } from "../../../../../model/DotDocument";
import type { DotStateProps } from "../../../../../state/DotStateProps";

import styles from "./ElementButtons.module.css";
// -----------------------------------------------------------------------------

type ElementButtonsProps = Omit<DotStateProps, "state"> & {
    element: CanvasElement;
};

export default function ElementButtons({
    dispatch,
    element,
}: ElementButtonsProps): ReactElement {
    return (
        <div className={styles.overlayContainer} style={{ ...element.area }}>
            <button
                className={styles.editBtn}
                style={{
                    top: 5,
                    left: 5,
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() =>
                    dispatch({
                        type: "element/edit",
                        payload: element.id,
                    })
                }
            >
                edit
            </button>
            <button
                className={styles.editBtn}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() =>
                    dispatch({
                        type: "element/copy",
                        payload: {
                            id: element.id,
                            newId: crypto.randomUUID(),
                        },
                    })
                }
            >
                copy
            </button>
        </div>
    );
}
