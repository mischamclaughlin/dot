import type { ReactElement, RefObject } from "react";
import { Fragment } from "react";

import type { DotStateProps } from "../../../state/DotStateProps";
import type { SingleDot } from "../../../types/DotTypes";

import { styleCSS } from "./shared/StyleCSS";

import DragBox from "./Overlay/components/DragBox";
import ElementButtons from "./Overlay/components/ElementButtons";

import styles from "./SavedElements.module.css";
// -----------------------------------------------------------------------------

type SavedElementsProps = DotStateProps & {
    canvasRef: RefObject<HTMLDivElement | null>;
    pan: SingleDot;
};

export default function SavedElements({
    state,
    dispatch,
    canvasRef,
    pan,
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
                            className={`
                                ${styles.savedElement}
                                ${state.selectedElementIds.has(element.id) ? styles.selectedElement : ""}
                                `}
                            style={{
                                ...styleCSS(element.style),
                                ...element.area,
                            }}
                        >
                            {element.text}
                        </div>

                        <ElementButtons
                            dispatch={dispatch}
                            element={element}
                            isSelected={state.selectedElementIds.has(
                                element.id,
                            )}
                        />

                        <DragBox
                            area={element.area}
                            canvasRef={canvasRef}
                            onChangeArea={(area) =>
                                dispatch({
                                    type: "change/element/area",
                                    payload: {
                                        id: element.id,
                                        area: area,
                                    },
                                })
                            }
                            pan={pan}
                        />
                    </Fragment>
                ))}
        </>
    );
}
