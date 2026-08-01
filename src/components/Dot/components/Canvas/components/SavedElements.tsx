import { Fragment, type ReactElement, type RefObject } from "react";

import type { DotStateProps } from "../../../state/DotStateProps";

import { styleCSS } from "./shared/StyleCSS";

import stylesArea from "../styles/Area.module.css";
import DragBox from "./DragBox";
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
                            className={stylesArea.savedElement}
                            style={{
                                ...styleCSS(element.style),
                                ...element.area,
                            }}
                        >
                            {element.text}
                        </div>
                        <button
                            className={stylesArea.editBtn}
                            style={{
                                left: element.area.left + 4,
                                top: element.area.top + element.area.height - 4,
                                transform: "translateY(-100%)",
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
                        <DragBox
                            state={state}
                            dispatch={dispatch}
                            canvasRef={canvasRef}
                        />
                    </Fragment>
                ))}
        </>
    );
}
