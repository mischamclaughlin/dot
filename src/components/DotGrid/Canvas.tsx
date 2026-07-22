import type { Dispatch, ReactElement } from "react";
import React, {
    Fragment,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import type { Action, State } from "./state/Reducer";

import type {
    CanvasItem,
    Dot,
    ResizeEdge,
    SelectionArea,
} from "./types/DotGridTypes";

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

    const [draftArea, setDraftArea] = useState<SelectionArea | null>(null);
    const [selectArea, setSelectArea] = useState<SelectionArea | null>(null);
    const [toolArea, setToolArea] = useState<SelectionArea | null>(null);

    const [text, setText] = useState("");

    const [items, setItems] = useState<CanvasItem[] | null>(null);

    const [resizeEdge, setResizeEdge] = useState<ResizeEdge | null>(null);

    const resetDrag = useCallback(() => {
        setIsDragging(false);
        setDragStartDot(null);
        setDraftArea(null);
    }, []);

    useEffect(() => {
        function handleWindowKeyDown(e: KeyboardEvent) {
            if (e.key !== "Escape") return;

            resetDrag();

            setSelectArea(null);

            setToolArea(null);

            dispatch({
                type: "save/valid",
                payload: true,
            });

            setText("");

            dispatch({
                type: "tool/selected",
                payload: null,
            });
        }

        window.addEventListener("keydown", handleWindowKeyDown);

        return () => window.removeEventListener("keydown", handleWindowKeyDown);
    }, [dispatch, resetDrag]);

    useEffect(() => {
        function handleElementSave() {
            if (!state.isSaved) return;

            dispatch({
                type: "save/saved",
                payload: false,
            });

            if (!toolArea || !state.tool) return;

            const item: CanvasItem = {
                id: crypto.randomUUID(),
                type: state.tool,
                text: text,
                style: state.activeStyle ?? defaultStyle,
                area: toolArea,
            };

            setItems((current) => [...(current ?? []), item]);

            setToolArea(null);
            dispatch({
                type: "save/valid",
                payload: false,
            });

            setText("");
        }

        handleElementSave();
    }, [
        dispatch,
        state.activeStyle,
        state.isSaved,
        state.tool,
        text,
        toolArea,
    ]);

    useEffect(() => {
        function handleToolArea() {
            if (!state.tool || !selectArea) return;

            setToolArea(selectArea);
            dispatch({
                type: "save/valid",
                payload: true,
            });

            setSelectArea(null);
        }

        handleToolArea();
    }, [dispatch, selectArea, state.tool]);

    useEffect(() => {
        function handleGoBack() {
            if (!state.isBack) return;

            dispatch({
                type: "move/back",
                payload: false,
            });

            dispatch({
                type: "tool/selected",
                payload: null,
            });

            if (!toolArea) return;

            setSelectArea(toolArea);

            setToolArea(null);
            dispatch({
                type: "save/valid",
                payload: false,
            });
        }

        handleGoBack();
    }, [dispatch, state.isBack, toolArea]);

    function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
        const nextactiveDot = service.getNextActiveDot(e);

        if (!service.isSameDot(hoverDot, nextactiveDot)) {
            setHoverDot(nextactiveDot);
        }

        if (!isDragging || !dragStartDot) return;

        setDraftArea(service.updateTempArea(dragStartDot, nextactiveDot));
    }

    function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
        e.currentTarget.setPointerCapture(e.pointerId);

        const nextActiveDot = service.getNextActiveDot(e);

        setIsDragging(true);
        setSelectArea(null);
        setDragStartDot(nextActiveDot);
    }

    function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
        const area = draftArea;

        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }

        resetDrag();

        if (!area) return;

        if (state.tool) {
            setToolArea(area);
            dispatch({
                type: "save/valid",
                payload: true,
            });
        } else setSelectArea(area);
    }

    function handlePointerCancel() {
        resetDrag();
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

        setItems(
            (current) =>
                current?.map((currentItem) =>
                    currentItem.id === item.id && currentItem.area
                        ? {
                              ...currentItem,
                              area: {
                                  ...currentItem.area,
                                  ...nextArea,
                              },
                          }
                        : currentItem,
                ) ?? null,
        );
    }

    function handleItemResizeEnd(e: React.PointerEvent<HTMLDivElement>) {
        e.stopPropagation();

        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }

        setResizeEdge(null);
    }

    const displayItems = items
        ? items.map((item) => {
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
                ${toolArea ? styles.focusToolArea : styles.focusContainer}
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
            {selectArea && (
                <div className={styles.selectArea} style={{ ...selectArea }} />
            )}
            {toolArea && state.tool === "text" && (
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onPointerDown={(e) => e.stopPropagation()}
                    className={
                        state.tool
                            ? `${styles[state.tool]} ${styles.activeTool}`
                            : undefined
                    }
                    style={{
                        ...defaultStyle,
                        ...(state.activeStyle ?? {}),
                        ...(toolArea ?? {}),
                    }}
                />
            )}
            {toolArea && state.tool === "image" && (
                <div
                    className={
                        state.tool
                            ? `${styles[state.tool]} ${styles.activeTool}`
                            : undefined
                    }
                    style={{ ...(toolArea ?? {}) }}
                />
            )}
            {displayItems}
        </div>
    );
}
