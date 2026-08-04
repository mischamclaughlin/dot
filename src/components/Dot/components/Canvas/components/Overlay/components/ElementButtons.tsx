import type { ReactElement } from "react";

import type { CanvasElement } from "../../../../../model/DotDocument";
import type { DotStateProps } from "../../../../../state/DotStateProps";

import styles from "./ElementButtons.module.css";
import { dotConfig } from "../../../../../dotConfig/DotConfig";
// -----------------------------------------------------------------------------

type ElementButtonsProps = Omit<DotStateProps, "state"> & {
    element: CanvasElement;
};

export default function ElementButtons({
    dispatch,
    element,
}: ElementButtonsProps): ReactElement {
    return (
        <div
            className={styles.overlayContainer}
            style={{
                left: element.area.left,
                top: element.area.top - dotConfig.gridSpacing * 2,
            }}
        >
            <div
                className={styles.hoverContainer}
                style={{ ...element.area }}
            />
            <div className={styles.buttonContainer}>
                <button
                    className={styles.btn}
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
                    className={styles.btn}
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
                <button
                    className={styles.btn}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() =>
                        dispatch({
                            type: "element/delete",
                            payload: element.id,
                        })
                    }
                >
                    delete
                </button>
            </div>
        </div>
    );
}
