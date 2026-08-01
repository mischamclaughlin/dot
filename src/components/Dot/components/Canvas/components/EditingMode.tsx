import type { ReactElement, RefObject } from "react";

import type { DotStateProps } from "../../../state/DotStateProps";

import { styleCSS } from "./shared/StyleCSS";

import DragBox from "./DragBox";

import stylesArea from "../styles/Area.module.css";
// -----------------------------------------------------------------------------

type EditingModeProps = DotStateProps & {
    canvasRef: RefObject<HTMLDivElement | null>;
};

export default function EditingMode({
    state,
    dispatch,
    canvasRef,
}: EditingModeProps): ReactElement {
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
                                        type: "draft/textChanged",
                                        payload: e.target.value,
                                    })
                                }
                                onPointerDown={(e) => {
                                    e.stopPropagation();
                                }}
                            />
                        </form>
                        <DragBox
                            state={state}
                            dispatch={dispatch}
                            canvasRef={canvasRef}
                        />
                    </>
                )}
        </>
    );
}
