import type { Dispatch, ReactElement, RefObject } from "react";
import React, { useState } from "react";

import type { Rect } from "../../../model/DotDocument";
import type { DotState } from "../../../model/DotDocumentState";
import type { Action } from "../../../state/DotReducer";

import { dotConfig } from "../../../dotConfig/DotConfig";
import { DotGeometryService } from "../../../services/DotGeometryService";

import stylesArea from "../styles/Area.module.css";
import styles from "./DragBox.module.css";
// -----------------------------------------------------------------------------

const geo = new DotGeometryService(dotConfig.gridSpacing);

type DragBoxProps = {
    state: DotState;
    dispatch: Dispatch<Action>;
    canvasRef: RefObject<HTMLDivElement | null>;
};

export default function DragBox({
    state,
    dispatch,
    canvasRef,
}: DragBoxProps): ReactElement {
    const [isDragging, setIsDragging] = useState(false);

    const stateArea =
        state.canvasMode.mode === "drawing"
            ? state.canvasMode.area
            : state.canvasMode.mode === "editing"
              ? state.canvasMode.element.area
              : undefined;

    const [resizeArea, setResizeArea] = useState<Rect | undefined>();

    const displayedArea = isDragging ? resizeArea : stateArea;

    function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
        if (!stateArea) return;

        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);

        setResizeArea(stateArea);
        setIsDragging(true);
    }

    function handlePointerMove(
        e: React.PointerEvent<HTMLDivElement>,
        edge: "left" | "right" | "top" | "bottom",
    ) {
        if (!isDragging) return;

        const current = geo.getCanvasDot(e, canvasRef);
        if (!current) return;

        setResizeArea((prevArea) => {
            if (!prevArea) return prevArea;

            const halfGrid = dotConfig.gridSpacing / 2;
            const minSize = dotConfig.gridSpacing;

            if (edge === "top") {
                const bottom = prevArea.top + prevArea.height;
                const nextTop = Math.min(
                    current.y - halfGrid,
                    bottom - minSize,
                );

                return {
                    ...prevArea,
                    top: nextTop,
                    height: bottom - nextTop,
                };
            }

            if (edge === "bottom") {
                const nextBottom = Math.max(
                    current.y + halfGrid,
                    prevArea.top + minSize,
                );

                return {
                    ...prevArea,
                    height: nextBottom - prevArea.top,
                };
            }

            if (edge === "left") {
                const right = prevArea.left + prevArea.width;
                const nextLeft = Math.min(
                    current.x - halfGrid,
                    right - minSize,
                );

                return {
                    ...prevArea,
                    left: nextLeft,
                    width: right - nextLeft,
                };
            }

            if (edge === "right") {
                const nextRight = Math.max(
                    current.x + halfGrid,
                    prevArea.left + minSize,
                );

                return {
                    ...prevArea,
                    width: nextRight - prevArea.left,
                };
            }

            return prevArea;
        });
    }

    function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }

        if (!resizeArea) return;

        dispatch({
            type: "edit/resize",
            payload: resizeArea,
        });

        setIsDragging(false);
        setResizeArea(undefined);
    }

    function handlePointerCancel(e: React.PointerEvent<HTMLDivElement>) {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }

        setIsDragging(false);
        setResizeArea(undefined);
    }

    return (
        <>
            <div className={styles.container} style={displayedArea}>
                <div
                    className={`
					${styles.bar}
					${styles.horizontal}
					${styles.top}
				`}
                    onPointerDown={handlePointerDown}
                    onPointerMove={(e) => handlePointerMove(e, "top")}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                />
                <div
                    className={`
					${styles.bar}
					${styles.horizontal}
					${styles.bottom}
				`}
                    onPointerDown={handlePointerDown}
                    onPointerMove={(e) => handlePointerMove(e, "bottom")}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                />
                <div
                    className={`
					${styles.bar}
					${styles.vertical}
					${styles.right}
				`}
                    onPointerDown={handlePointerDown}
                    onPointerMove={(e) => handlePointerMove(e, "right")}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                />
                <div
                    className={`
					${styles.bar}
					${styles.vertical}
					${styles.left}
				`}
                    onPointerDown={handlePointerDown}
                    onPointerMove={(e) => handlePointerMove(e, "left")}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                />
            </div>
            {resizeArea && (
                <div
                    className={stylesArea.resizeArea}
                    style={{
                        left: resizeArea.left,
                        width: resizeArea.width,
                        top: resizeArea.top,
                        height: resizeArea.height,
                    }}
                    onPointerDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                />
            )}
        </>
    );
}
