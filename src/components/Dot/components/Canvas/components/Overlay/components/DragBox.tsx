import type { ReactElement, RefObject } from "react";
import React, { useState } from "react";

import type {
    InheritableGeometryAttribute,
    Rect,
} from "../../../../../model/DotDocument";
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
    lockedDimensions?: readonly InheritableGeometryAttribute[];
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
    lockedDimensions = [],
}: DragBoxProps): ReactElement {
    const [isDragging, setIsDragging] = useState(false);

    const [resizeArea, setResizeArea] = useState<Rect | undefined>();

    const [moveStart, setMoveStart] = useState<MoveStart | null>(null);

    const displayedArea = isDragging ? resizeArea : area;

    function isEdgeLocked(edge: "left" | "right" | "top" | "bottom") {
        const dimension =
            edge === "left" || edge === "right" ? "width" : "height";

        return lockedDimensions.includes(dimension);
    }

    function handleResizePointerDown(
        e: React.PointerEvent<HTMLDivElement>,
        edge: "left" | "right" | "top" | "bottom",
    ) {
        e.preventDefault();
        e.stopPropagation();
        if (isEdgeLocked(edge)) return;

        e.currentTarget.setPointerCapture(e.pointerId);

        setResizeArea(area);
        setIsDragging(true);
    }

    function handleResizePointerMove(
        e: React.PointerEvent<HTMLDivElement>,
        edge: "left" | "right" | "top" | "bottom",
    ) {
        if (!isDragging || isEdgeLocked(edge)) return;

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
                    ${isEdgeLocked("top") ? styles.locked : ""}
                `}
                    aria-disabled={isEdgeLocked("top")}
                    onPointerDown={(e) =>
                        handleResizePointerDown(e, "top")
                    }
                    onPointerMove={(e) => handleResizePointerMove(e, "top")}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                />
                <div
                    className={`
					${styles.dragZone}
                    ${styles.horizontal}
                    ${styles.bottom}
                    ${isEdgeLocked("bottom") ? styles.locked : ""}
                `}
                    aria-disabled={isEdgeLocked("bottom")}
                    onPointerDown={(e) =>
                        handleResizePointerDown(e, "bottom")
                    }
                    onPointerMove={(e) => handleResizePointerMove(e, "bottom")}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                />
                <div
                    className={`
					${styles.dragZone}
                    ${styles.vertical}
                    ${styles.right}
                    ${isEdgeLocked("right") ? styles.locked : ""}
                `}
                    aria-disabled={isEdgeLocked("right")}
                    onPointerDown={(e) =>
                        handleResizePointerDown(e, "right")
                    }
                    onPointerMove={(e) => handleResizePointerMove(e, "right")}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                />
                <div
                    className={`
					${styles.dragZone}
                    ${styles.vertical}
                    ${styles.left}
                    ${isEdgeLocked("left") ? styles.locked : ""}
                `}
                    aria-disabled={isEdgeLocked("left")}
                    onPointerDown={(e) =>
                        handleResizePointerDown(e, "left")
                    }
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
