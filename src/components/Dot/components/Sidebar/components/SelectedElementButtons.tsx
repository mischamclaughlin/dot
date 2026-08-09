import type { ReactElement } from "react";
import type { DotStateProps } from "../../../state/DotStateProps";

import stylesBtn from "../styles/Button.module.css";

export default function SelctedElementButtons({
    state,
    dispatch,
}: DotStateProps): ReactElement {
    const selectedElements = state.document.elements.filter(
        (element) => state.selectedElementIds.has(element.id),
    );
    if (selectedElements.length <= 0) return <></>;

    return (
        <div className={stylesBtn.buttonsContainer}>
            <p className={stylesBtn.btnHeader}>SELECTED</p>
            <button
                className={stylesBtn.btn}
                onClick={() => dispatch({ type: "element/deselect" })}
            >
                clear
            </button>
            <button
                className={stylesBtn.btn}
                onClick={() =>
                    selectedElements.map((el) =>
                        dispatch({
                            type: "element/copy",
                            payload: { id: el.id, newId: crypto.randomUUID() },
                        }),
                    )
                }
            >
                copy
            </button>
            <button
                className={stylesBtn.btn}
                disabled={state.canvasMode.mode === "editing"}
                onClick={() =>
                    selectedElements.map((el) =>
                        dispatch({
                            type: "element/delete",
                            payload: el.id,
                        }),
                    )
                }
            >
                delete
            </button>
        </div>
    );
}
