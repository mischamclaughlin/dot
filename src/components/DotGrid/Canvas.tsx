import type { ReactElement } from "react";
import React, { useEffect, useRef, useState } from "react";

import type { DotGridProps } from "./types/DotGridProps";
import type { AreaResize, AreaStyle, Dot } from "./types/DotGridTypes";

import { DotGridService } from "./services/DotGridService";
import { defaultStyle } from "./tool/TextTool/TextStyles";

import DisplayItems from "./components/Canvas/DisplayItems";

import styles from "./Canvas.module.css";
// -----------------------------------------------------------------------------

const service = new DotGridService();

export default function Canvas({
    state,
    dispatch,
}: DotGridProps): ReactElement {
    const canvasRef = useRef<HTMLDivElement>(null);

    const [resizeArea, setResizeArea] = useState<AreaResize | null>(null);

    const [isDragging, setIsDragging] = useState<boolean>(false);

    const [hoverDot, setHoverDot] = useState<Dot | null>(null);
    const [dragStartDot, setDragStartDot] = useState<Dot | null>(null);

    const [draftArea, setDraftArea] = useState<AreaStyle | null>(null);

    useEffect(() => {
        function handleWindowKeyDown(e: KeyboardEvent) {
            if (e.key !== "Escape") return;

            setIsDragging(false);
            setDragStartDot(null);
            setDraftArea(null);

            dispatch({ type: "editing/cancel" });
        }

        window.addEventListener("keydown", handleWindowKeyDown);

        return () => window.removeEventListener("keydown", handleWindowKeyDown);
    }, [dispatch]);

    function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
        const nextActiveDot = service.getNextActiveDot(e);

        if (!service.isSameDot(hoverDot, nextActiveDot)) {
            setHoverDot(nextActiveDot);
        }

        if (!isDragging || !dragStartDot) return;

        setDraftArea(service.updateTempArea(dragStartDot, nextActiveDot));
    }

    function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
        e.currentTarget.setPointerCapture(e.pointerId);

        const nextActiveDot = service.getNextActiveDot(e);

        setIsDragging(true);

        dispatch({
            type: "area/selected",
            payload: null,
        });

        setDragStartDot(nextActiveDot);
    }

    function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
        const area = draftArea;

        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }

        setIsDragging(false);
        setDragStartDot(null);
        setDraftArea(null);

        if (!area) return;

        if (state.tool) {
            dispatch({
                type: "area/tool",
                payload: area,
            });
        } else {
            dispatch({
                type: "area/selected",
                payload: area,
            });
        }
    }

    function handlePointerCancel() {
        setIsDragging(false);
        setDragStartDot(null);
        setDraftArea(null);
    }

    return (
        <div
            ref={canvasRef}
            className={`
                ${styles.container}
                ${state.toolArea ? styles.focusToolArea : styles.focusContainer}
                `}
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            style={{
                backgroundSize: `${service.gridSize}px ${service.gridSize}px`,
            }}
        >
            {hoverDot && (
                <div
                    className={styles.hoverDot}
                    style={{ left: hoverDot.x, top: hoverDot.y }}
                />
            )}
            {dragStartDot && (
                <div
                    className={styles.dragStartDot}
                    style={{ left: dragStartDot.x, top: dragStartDot.y }}
                />
            )}
            {draftArea && (
                <div className={styles.draftArea} style={{ ...draftArea }} />
            )}
            {state.activeArea && (
                <div
                    className={styles.selectArea}
                    style={{ ...state.activeArea }}
                />
            )}
            {state.toolArea && state.tool === "text" && (
                <textarea
                    value={state.itemText}
                    onChange={(e) =>
                        dispatch({
                            type: "item/text",
                            payload: e.target.value,
                        })
                    }
                    onPointerDown={(e) => e.stopPropagation()}
                    className={`${styles[state.tool]} ${styles.activeTool}`}
                    style={{
                        ...defaultStyle,
                        ...state.itemStyle,
                        ...state.toolArea,
                        ...resizeArea,
                    }}
                />
            )}
            {state.toolArea && state.tool === "image" && (
                <div
                    className={`${styles[state.tool]} ${styles.activeTool}`}
                    style={{ ...state.toolArea }}
                />
            )}
            <DisplayItems
                canvasRef={canvasRef}
                items={state.canvasItems}
                dispatch={dispatch}
                onResizeArea={setResizeArea}
            />
        </div>
    );
}
