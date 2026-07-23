import type { Dispatch, ReactElement } from "react";
import React, { Fragment, useEffect, useRef, useState } from "react";

import type { Action, State } from "./state/DotGridReducer";
import type {
    CanvasItem,
    Dot,
    ResizeEdge,
    SelectionArea,
} from "./types/DotGridTypes";

import { DotGridService } from "./services/DotGridService";
import { defaultStyle } from "./styles/DotGridStyles";

import styles from "./Canvas.module.css";

const service = new DotGridService();

type CanvasProps = { state: State; dispatch: Dispatch<Action> };

export default function Canvas({ state, dispatch }: CanvasProps): ReactElement {
    const canvasRef = useRef<HTMLDivElement>(null);

    const [isDragging, setIsDragging] = useState<boolean>(false);

    const [hoverDot, setHoverDot] = useState<Dot | null>(null);
    const [dragStartDot, setDragStartDot] = useState<Dot | null>(null);

    const [draftArea, setDraftArea] = useState<SelectionArea | null>(null);

    const [resizeEdge, setResizeEdge] = useState<ResizeEdge | null>(null);

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

    function handleItemResizeStart(
        e: React.PointerEvent<HTMLDivElement>,
        edge: ResizeEdge,
    ) {
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        setResizeEdge(edge);
    }
    function handleItemResizeMove(
        e: React.PointerEvent<HTMLDivElement>,
        item: CanvasItem,
    ) {
        e.stopPropagation();

        if (!resizeEdge) return;

        const nextDot = service.getCanvasDot(e, canvasRef);
        if (!nextDot) return;

        const offset = service.gridSize / 2;

        const leftDot: Dot = {
            x: item.area.left + offset,
            y: nextDot.y,
        };

        const rightDot: Dot = {
            x: item.area.left + item.area.width - offset,
            y: nextDot.y,
        };

        const topDot: Dot = {
            x: nextDot.x,
            y: item.area.top + offset,
        };

        const bottomDot: Dot = {
            x: nextDot.x,
            y: item.area.top + item.area.height - offset,
        };

        const nextArea =
            resizeEdge === "left"
                ? service.updateItemWidth(nextDot, rightDot)
                : resizeEdge === "right"
                  ? service.updateItemWidth(leftDot, nextDot)
                  : resizeEdge === "top"
                    ? service.updateItemHeight(nextDot, bottomDot)
                    : service.updateItemHeight(topDot, nextDot);

        dispatch({
            type: "canvas/resize",
            payload: { id: item.id, nextArea: nextArea },
        });
    }

    function handleItemResizeEnd(e: React.PointerEvent<HTMLDivElement>) {
        e.stopPropagation();

        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }

        setResizeEdge(null);
    }

    const displayItems = state.canvasItems.map((item) => {
        const { width, height } = item.area;
        const dragBarSize = 7.5;

        return (
            <Fragment key={item.id}>
                <div
                    key={item.id}
                    className={styles.savedElement}
                    style={{ ...item.style, ...item.area }}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    {item.text}
                </div>
                <div
                    className={styles.dragBarContainer}
                    style={{ ...item.area }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onPointerMove={(e) => e.stopPropagation()}
                >
                    <div
                        className={styles.dragBar}
                        style={{
                            top: 0,
                            width: width - 2,
                            height: dragBarSize,
                            cursor: "row-resize",
                        }}
                        onPointerDown={(e) => handleItemResizeStart(e, "top")}
                        onPointerMove={(e) => handleItemResizeMove(e, item)}
                        onPointerUp={handleItemResizeEnd}
                        onPointerCancel={handleItemResizeEnd}
                    />
                    <div
                        className={styles.dragBar}
                        style={{
                            bottom: 0,
                            width: width - 2,
                            height: dragBarSize,
                            cursor: "row-resize",
                        }}
                        onPointerDown={(e) =>
                            handleItemResizeStart(e, "bottom")
                        }
                        onPointerMove={(e) => handleItemResizeMove(e, item)}
                        onPointerUp={handleItemResizeEnd}
                        onPointerCancel={handleItemResizeEnd}
                    />
                    <div
                        className={styles.dragBar}
                        style={{
                            left: 0,
                            height: height - 2,
                            width: dragBarSize,
                            cursor: "col-resize",
                        }}
                        onPointerDown={(e) => handleItemResizeStart(e, "left")}
                        onPointerMove={(e) => handleItemResizeMove(e, item)}
                        onPointerUp={handleItemResizeEnd}
                        onPointerCancel={handleItemResizeEnd}
                    />
                    <div
                        className={styles.dragBar}
                        style={{
                            right: 0,
                            height: height - 2,
                            width: dragBarSize,
                            cursor: "col-resize",
                        }}
                        onPointerDown={(e) => handleItemResizeStart(e, "right")}
                        onPointerMove={(e) => handleItemResizeMove(e, item)}
                        onPointerUp={handleItemResizeEnd}
                        onPointerCancel={handleItemResizeEnd}
                    />
                </div>
            </Fragment>
        );
    });

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
                    }}
                />
            )}
            {state.toolArea && state.tool === "image" && (
                <div
                    className={`${styles[state.tool]} ${styles.activeTool}`}
                    style={{ ...state.toolArea }}
                />
            )}
            {displayItems}
        </div>
    );
}
