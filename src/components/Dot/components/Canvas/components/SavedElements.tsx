import type { ReactElement, RefObject } from "react";
import { Fragment } from "react";

import type { DotStateProps } from "../../../state/DotStateProps";

import { styleCSS } from "./shared/StyleCSS";

import DragBox from "./DragBox";

import stylesArea from "../styles/Area.module.css";
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
                                top: element.area.top + 4,
                                left: element.area.left + 4,
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
