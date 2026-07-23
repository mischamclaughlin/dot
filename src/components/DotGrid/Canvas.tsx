import type { Dispatch, ReactElement } from "react";
import React, { Fragment, useEffect, useRef, useState } from "react";

import type { Action, State } from "./state/DotGridReducer";
import type { CanvasItem, Dot, ResizeEdge } from "./types/DotGridTypes";

import { DotGridService } from "./services/DotGridService";
import { defaultStyle } from "./styles/DotGridStyles";

import styles from "./Canvas.module.css";

type CanvasProps = { state: State; dispatch: Dispatch<Action> };

export default function Canvas({ state, dispatch }: CanvasProps): ReactElement {
    const service = new DotGridService();

    const canvasRef = useRef<HTMLDivElement>(null);

    const [isDragging, setIsDragging] = useState<boolean>(false);

    const [hoverDot, setHoverDot] = useState<Dot | null>(null);
    const [dragStartDot, setDragStartDot] = useState<Dot | null>(null);

    const [resizeEdge, setResizeEdge] = useState<ResizeEdge | null>(null);

    useEffect(() => {
        function handleWindowKeyDown(e: KeyboardEvent) {
            if (e.key !== "Escape") return;

            setIsDragging(false);
            setDragStartDot(null);

            dispatch({ type: "key/escape" });
        }

        window.addEventListener("keydown", handleWindowKeyDown);

        return () => window.removeEventListener("keydown", handleWindowKeyDown);
    }, [dispatch]);

    useEffect(() => {
        function handleToolArea() {
            if (!state.tool || !state.activeArea) return;

            dispatch({
                type: "area/tool",
                payload: state.activeArea,
            });

            dispatch({
                type: "area/active",
                payload: null,
            });
        }

        handleToolArea();
    }, [dispatch, state.activeArea, state.tool]);

    function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
        const nextactiveDot = service.getNextActiveDot(e);

        if (!service.isSameDot(hoverDot, nextactiveDot)) {
            setHoverDot(nextactiveDot);
        }

        if (!isDragging || !dragStartDot) return;

        dispatch({
            type: "area/draft",
            payload: service.updateTempArea(dragStartDot, nextactiveDot),
        });
    }

    function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
        e.currentTarget.setPointerCapture(e.pointerId);

        const nextActiveDot = service.getNextActiveDot(e);

        setIsDragging(true);

        dispatch({
            type: "area/active",
            payload: null,
        });

        setDragStartDot(nextActiveDot);
    }

    function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
        const area = state.draftArea;

        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }

        setIsDragging(false);
        setDragStartDot(null);

        dispatch({
            type: "area/draft",
            payload: null,
        });

        if (!area) return;

        if (state.tool) {
            dispatch({
                type: "area/tool",
                payload: area,
            });
        } else {
            dispatch({
                type: "area/active",
                payload: area,
            });
        }
    }

    function handlePointerCancel() {
        setIsDragging(false);
        setDragStartDot(null);

        dispatch({
            type: "area/draft",
            payload: null,
        });
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

        if (!resizeEdge || !item.area) return;

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
            type: "canvas/item-resize",
            payload: { item: item, nextArea: nextArea },
        });
    }

    function handleItemResizeEnd(e: React.PointerEvent<HTMLDivElement>) {
        e.stopPropagation();

        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }

        setResizeEdge(null);
    }

    const displayItems = state.canvasItems
        ? state.canvasItems.map((item) => {
              if (!item.area) return undefined;

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
                              onPointerDown={(e) =>
                                  handleItemResizeStart(e, "top")
                              }
                              onPointerMove={(e) =>
                                  handleItemResizeMove(e, item)
                              }
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
                              onPointerMove={(e) =>
                                  handleItemResizeMove(e, item)
                              }
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
                              onPointerDown={(e) =>
                                  handleItemResizeStart(e, "left")
                              }
                              onPointerMove={(e) =>
                                  handleItemResizeMove(e, item)
                              }
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
                              onPointerDown={(e) =>
                                  handleItemResizeStart(e, "right")
                              }
                              onPointerMove={(e) =>
                                  handleItemResizeMove(e, item)
                              }
                              onPointerUp={handleItemResizeEnd}
                              onPointerCancel={handleItemResizeEnd}
                          />
                      </div>
                  </Fragment>
              );
          })
        : null;

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
            {state.draftArea && (
                <div
                    className={styles.draftArea}
                    style={{ ...state.draftArea }}
                />
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
                    className={
                        state.tool
                            ? `${styles[state.tool]} ${styles.activeTool}`
                            : undefined
                    }
                    style={{
                        ...defaultStyle,
                        ...(state.itemStyle ?? {}),
                        ...(state.toolArea ?? {}),
                    }}
                />
            )}
            {state.toolArea && state.tool === "image" && (
                <div
                    className={
                        state.tool
                            ? `${styles[state.tool]} ${styles.activeTool}`
                            : undefined
                    }
                    style={{ ...(state.toolArea ?? {}) }}
                />
            )}
            {displayItems}
        </div>
    );
}
