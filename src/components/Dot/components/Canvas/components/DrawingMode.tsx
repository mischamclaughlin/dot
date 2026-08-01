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
                            className={stylesArea.selectArea}
                            style={state.canvasMode.session.element.area}
                            onPointerDown={(e) => {
                                e.stopPropagation();
                            }}
                        />
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
