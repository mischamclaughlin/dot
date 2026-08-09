import type { ReactElement, RefObject } from "react";

import type { DotStateProps } from "../../../state/DotStateProps";

import DragBox from "./Overlay/components/DragBox";

import stylesArea from "../styles/Area.module.css";
import type { SingleDot } from "../../../types/DotTypes";
// -----------------------------------------------------------------------------

type DrawingModeProps = DotStateProps & {
    canvasRef: RefObject<HTMLDivElement | null>;
    pan: SingleDot;
};

export default function DrawingMode({
    state,
    dispatch,
    canvasRef,
    pan,
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
                            onChangeArea={(area) =>
                                dispatch({
                                    type: "change/draft/area",
                                    payload: area,
                                })
                            }
                            pan={pan}
                        />
                    </>
                )}
        </>
    );
}
