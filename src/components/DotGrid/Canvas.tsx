import type { Dispatch, ReactElement } from "react";
import React, { Fragment, useEffect, useRef, useState } from "react";

import type { Action, State } from "./state/DotGridReducer";
import type {
    Dot,
    AreaResize,
    EdgeResize,
    AreaStyle,
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

    const [draftArea, setDraftArea] = useState<AreaStyle | null>(null);

    const [resizeArea, setResizeArea] = useState<AreaResize | null>(null);

    const [resizeEdge, setResizeEdge] = useState<EdgeResize | null>(null);

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
        edge: EdgeResize,
    ) {
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        setResizeEdge(edge);
    }
    function handleItemResizeMove(
        e: React.PointerEvent<HTMLDivElement>,
        id: string | null,
        area: AreaStyle,
    ) {
        e.stopPropagation();

        if (!resizeEdge) return;

        const nextDot = service.getCanvasDot(e, canvasRef);
        if (!nextDot) return;

        const offset = service.gridSize / 2;

        const leftDot: Dot = {
            x: area.left + offset,
            y: nextDot.y,
        };

        const rightDot: Dot = {
            x: area.left + area.width - offset,
            y: nextDot.y,
        };

        const topDot: Dot = {
            x: nextDot.x,
            y: area.top + offset,
        };

        const bottomDot: Dot = {
            x: nextDot.x,
            y: area.top + area.height - offset,
        };

        const nextArea =
            resizeEdge === "left"
                ? service.updateItemWidth(nextDot, rightDot)
                : resizeEdge === "right"
                  ? service.updateItemWidth(leftDot, nextDot)
                  : resizeEdge === "top"
                    ? service.updateItemHeight(nextDot, bottomDot)
                    : service.updateItemHeight(topDot, nextDot);

        if (id) {
            dispatch({
                type: "item/resize",
                payload: { id: id, nextArea: nextArea },
            });
        } else {
            setResizeArea(nextArea);
        }
    }

    function handleItemResizeEnd(e: React.PointerEvent<HTMLDivElement>) {
        e.stopPropagation();

        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }

        setResizeEdge(null);
    }

    function handleEditItem(id: string) {
        dispatch({
            type: "editing/item",
            payload: id,
        });
    }

    const displayItems = state.canvasItems.map((item) => {
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
                {dragBox(item.id, item.area)}
            </Fragment>
        );
    });

    function dragBox(id: string, area: AreaStyle) {
        const { width, height } = area;
        const dragBarSize = 7.5;

        return (
            <div
                className={styles.dragBarContainer}
                style={{ ...area }}
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
                    onPointerMove={(e) => handleItemResizeMove(e, id, area)}
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
                    onPointerDown={(e) => handleItemResizeStart(e, "bottom")}
                    onPointerMove={(e) => handleItemResizeMove(e, id, area)}
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
                    onPointerMove={(e) => handleItemResizeMove(e, id, area)}
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
                    onPointerMove={(e) => handleItemResizeMove(e, id, area)}
                    onPointerUp={handleItemResizeEnd}
                    onPointerCancel={handleItemResizeEnd}
                />
                <button
                    className={styles.button}
                    onClick={() => handleEditItem(id)}
                >
                    Edit
                </button>
            </div>
        );
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
            {displayItems}
        </div>
    );
}
