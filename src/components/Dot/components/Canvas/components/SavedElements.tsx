import type { ReactElement, RefObject } from "react";
import { Fragment } from "react";

import type { DotStateProps } from "../../../state/DotStateProps";

import { styleCSS } from "./shared/StyleCSS";

import DragBox from "./DragBox";

import styles from "./SavedElements.module.css";
// -----------------------------------------------------------------------------

type SavedElementsProps = DotStateProps & {
    canvasRef: RefObject<HTMLDivElement | null>;
};

export default function SavedElements({
    state,
    dispatch,
    canvasRef,
}: SavedElementsProps): ReactElement {
    const activeEditId =
        state.canvasMode.mode === "idle"
            ? null
            : state.canvasMode.session.editId;

    return (
        <>
            {state.document.elements
                .filter((element) => element.id !== activeEditId)
                .map((element) => (
                    <Fragment key={element.id}>
                        <div
                            className={styles.savedElement}
                            style={{
                                ...styleCSS(element.style),
                                ...element.area,
                            }}
                        >
                            {element.text}
                        </div>
                        <div
                            className={styles.overlayContainer}
                            style={{ ...element.area }}
                        >
                            <button
                                className={styles.editBtn}
                                style={{
                                    top: 0,
                                    left: 0,
                                }}
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={() =>
                                    dispatch({
                                        type: "canvasMode/editElement",
                                        payload: element.id,
                                    })
                                }
                            >
                                edit
                            </button>
                        </div>
                        <DragBox
                            area={element.area}
                            canvasRef={canvasRef}
                            onResize={(area) =>
                                dispatch({
                                    type: "resize/element",
                                    payload: {
                                        id: element.id,
                                        area: area,
                                    },
                                })
                            }
                        />
                    </Fragment>
                ))}
        </>
    );
}
