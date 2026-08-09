import type { ReactElement, RefObject } from "react";
import React, { useState } from "react";

import type { Rect } from "../../../../../model/DotDocument";
import type { SingleDot } from "../../../../../types/DotTypes";

import { dotConfig } from "../../../../../dotConfig/DotConfig";
import { DotGeometryService } from "../../../../../services/DotGeometryService";

import stylesArea from "../../../styles/Area.module.css";
import styles from "./DragBox.module.css";
// -----------------------------------------------------------------------------

const geo = new DotGeometryService(dotConfig.gridSpacing);

type DragBoxProps = {
    area: Rect;
    canvasRef: RefObject<HTMLDivElement | null>;
    onChangeArea: (area: Rect) => void;
    pan: SingleDot;
};

type MoveStart = {
    dot: SingleDot;
    area: Rect;
};

export default function DragBox({
    area,
    canvasRef,
    onChangeArea,
    pan,
}: DragBoxProps): ReactElement {
    const [isDragging, setIsDragging] = useState(false);

    const [resizeArea, setResizeArea] = useState<Rect | undefined>();

    const [moveStart, setMoveStart] = useState<MoveStart | null>(null);

    const displayedArea = isDragging ? resizeArea : area;

    function handleResizePointerDown(e: React.PointerEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);

        setResizeArea(area);
        setIsDragging(true);
    }

    function handleResizePointerMove(
        e: React.PointerEvent<HTMLDivElement>,
        edge: "left" | "right" | "top" | "bottom",
    ) {
        if (!isDragging) return;

        const current = geo.getCanvasDot(e, canvasRef, pan);
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

    function handleMovePointerDown(e: React.PointerEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();

        const dot = geo.getCanvasDot(e, canvasRef, pan);
        if (!dot) return;

        e.currentTarget.setPointerCapture(e.pointerId);

        setMoveStart({
            dot,
            area,
        });

        setResizeArea(area);
        setIsDragging(true);
    }

    function handleMovePointerMove(e: React.PointerEvent<HTMLDivElement>) {
        if (!moveStart) return;

        const currentDot = geo.getCanvasDot(e, canvasRef, pan);
        if (!currentDot) return;

        const deltaX = currentDot.x - moveStart.dot.x;
        const deltaY = currentDot.y - moveStart.dot.y;

        const nextArea: Rect = {
            ...moveStart.area,
            left: moveStart.area.left + deltaX,
            top: moveStart.area.top + deltaY,
        };

        setResizeArea(nextArea);
        onChangeArea(nextArea);
    }

    function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }

        if (!resizeArea) return;

        onChangeArea(resizeArea);

        setIsDragging(false);
        setResizeArea(undefined);
        setMoveStart(null);
    }

    function handlePointerCancel(e: React.PointerEvent<HTMLDivElement>) {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }

        setIsDragging(false);
        setResizeArea(undefined);
        setMoveStart(null);
    }

    return (
        <>
            <div className={styles.container} style={displayedArea}>
                <div
                    className={`
					${styles.dragZone}
					${styles.square}
					${styles.topLeft}
				`}
                    onPointerDown={handleMovePointerDown}
                    onPointerMove={handleMovePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                />
                <div
                    className={`
					${styles.dragZone}
					${styles.square}
					${styles.topRight}
				`}
                    onPointerDown={handleMovePointerDown}
                    onPointerMove={handleMovePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                />
                <div
                    className={`
					${styles.dragZone}
					${styles.square}
					${styles.bottomLeft}
				`}
                    onPointerDown={handleMovePointerDown}
                    onPointerMove={handleMovePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                />
                <div
                    className={`
					${styles.dragZone}
					${styles.square}
					${styles.bottomRight}
				`}
                    onPointerDown={handleMovePointerDown}
                    onPointerMove={handleMovePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                />
                <div
                    className={`
					${styles.dragZone}
					${styles.horizontal}
					${styles.top}
				`}
                    onPointerDown={handleResizePointerDown}
                    onPointerMove={(e) => handleResizePointerMove(e, "top")}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                />
                <div
                    className={`
					${styles.dragZone}
					${styles.horizontal}
					${styles.bottom}
				`}
                    onPointerDown={handleResizePointerDown}
                    onPointerMove={(e) => handleResizePointerMove(e, "bottom")}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                />
                <div
                    className={`
					${styles.dragZone}
					${styles.vertical}
					${styles.right}
				`}
                    onPointerDown={handleResizePointerDown}
                    onPointerMove={(e) => handleResizePointerMove(e, "right")}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                />
                <div
                    className={`
					${styles.dragZone}
					${styles.vertical}
					${styles.left}
				`}
                    onPointerDown={handleResizePointerDown}
                    onPointerMove={(e) => handleResizePointerMove(e, "left")}
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
