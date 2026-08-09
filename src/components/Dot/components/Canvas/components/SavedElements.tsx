import type { ReactElement, RefObject } from "react";
import { Fragment } from "react";

import type { DotStateProps } from "../../../state/DotStateProps";
import type { SingleDot } from "../../../types/DotTypes";
import {
    getInheritedAttributes,
    resolveElement,
} from "../../../services/DotInheritanceService";

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
                .map((element) => {
                    const resolvedElement = resolveElement(
                        state.document,
                        element.id,
                    );
                    if (!resolvedElement) return null;

                    const inheritedAttributes = getInheritedAttributes(
                        state.document,
                        element.id,
                    );

                    return (
                        <Fragment key={resolvedElement.id}>
                            <div
                                className={`
                                    ${styles.savedElement}
                                    ${state.selectedElementIds.has(resolvedElement.id) ? styles.selectedElement : ""}
                                    `}
                                style={{
                                    ...styleCSS(resolvedElement.style),
                                    ...resolvedElement.area,
                                }}
                            >
                                {resolvedElement.text}
                            </div>

                            <ElementButtons
                                dispatch={dispatch}
                                element={resolvedElement}
                                isSelected={state.selectedElementIds.has(
                                    resolvedElement.id,
                                )}
                            />

                            <DragBox
                                area={resolvedElement.area}
                                canvasRef={canvasRef}
                                onChangeArea={(area) =>
                                    dispatch({
                                        type: "change/element/area",
                                        payload: {
                                            id: resolvedElement.id,
                                            area: area,
                                        },
                                    })
                                }
                                lockedDimensions={inheritedAttributes.geometry}
                                pan={pan}
                            />
                        </Fragment>
                    );
                })}
        </>
    );
}
