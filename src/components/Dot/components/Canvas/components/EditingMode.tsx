import type { ReactElement, RefObject } from "react";

import type { DotStateProps } from "../../../state/DotStateProps";

import { styleCSS } from "./shared/StyleCSS";

import DragBox from "./Overlay/components/DragBox";

import stylesArea from "../styles/Area.module.css";
import type { SingleDot } from "../../../types/DotTypes";
import { getInheritedAttributes } from "../../../services/DotInheritanceService";
// -----------------------------------------------------------------------------

type EditingModeProps = DotStateProps & {
    canvasRef: RefObject<HTMLDivElement | null>;
    pan: SingleDot;
};

export default function EditingMode({
    state,
    dispatch,
    canvasRef,
    pan,
}: EditingModeProps): ReactElement {
    const inheritedGeometry =
        state.canvasMode.mode === "editing" &&
        state.canvasMode.session.editId
            ? getInheritedAttributes(
                  state.document,
                  state.canvasMode.session.editId,
              ).geometry
            : [];

    function handleSave(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (state.canvasMode.mode !== "editing") return;

        const session = state.canvasMode.session;

        dispatch({
            type: "action/save",
            payload: {
                id: session.editId ?? crypto.randomUUID(),
                element: session.element,
            },
        });
    }

    return (
        <>
            {state.canvasMode.mode === "editing" &&
                state.canvasMode.session.element.area && (
                    <>
                        <form id="text-edit-form" onSubmit={handleSave}>
                            <textarea
                                className={stylesArea.editArea}
                                style={{
                                    ...styleCSS(
                                        state.canvasMode.session.element.style,
                                    ),
                                    ...state.canvasMode.session.element.area,
                                }}
                                name="text"
                                value={state.canvasMode.session.element.text}
                                onChange={(e) =>
                                    dispatch({
                                        type: "change/draft/text",
                                        payload: e.target.value,
                                    })
                                }
                                onPointerDown={(e) => {
                                    e.stopPropagation();
                                }}
                            />
                        </form>
                        <DragBox
                            area={state.canvasMode.session.element.area}
                            canvasRef={canvasRef}
                            onChangeArea={(area) =>
                                dispatch({
                                    type: "change/draft/area",
                                    payload: area,
                                })
                            }
                            lockedDimensions={inheritedGeometry}
                            pan={pan}
                        />
                    </>
                )}
        </>
    );
}
