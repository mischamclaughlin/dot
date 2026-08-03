import type { ReactElement, RefObject } from "react";

import type { DotStateProps } from "../../../state/DotStateProps";

import DragBox from "./DragBox";

import stylesArea from "../styles/Area.module.css";
// -----------------------------------------------------------------------------

type DrawingModeProps = DotStateProps & {
    canvasRef: RefObject<HTMLDivElement | null>;
};

export default function DrawingMode({
    state,
    dispatch,
    canvasRef,
}: DrawingModeProps): ReactElement {
    return (
        <>
            {state.canvasMode.mode === "drawing" &&
                state.canvasMode.session.element.area && (
                    <>
                        <div
                            data-testid="select-area"
                            className={stylesArea.selectArea}
                            style={state.canvasMode.session.element.area}
                            onPointerDown={(e) => {
                                e.stopPropagation();
                            }}
                        />
                        <DragBox
                            area={state.canvasMode.session.element.area}
                            canvasRef={canvasRef}
                            onResize={(area) =>
                                dispatch({
                                    type: "resize/area",
                                    payload: area,
                                })
                            }
                        />
                    </>
                )}
        </>
    );
}
