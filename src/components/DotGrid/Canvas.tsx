import React, {
    Fragment,
    type ReactElement,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import type {
    AreaStyle,
    CanvasItem,
    CanvasTool,
    Dot,
    ResizeEdge,
    SelectionArea,
} from "./types/DotGridTypes";

import styles from "./Canvas.module.css";
import { DotGridService } from "./services/DotGridService";
import { defaultStyle } from "./styles/DotGridStyles";

type CanvasProps = {
    activeTool: CanvasTool;
    activeStyle: AreaStyle | null;
    isSaved: boolean;
    isGoBack: boolean;
    onSelectTool: (tool: CanvasTool) => void;
    onSaveable: (isSave: boolean) => void;
    onSaveItem: (isSaved: boolean) => void;
    onGoBack: (isBack: boolean) => void;
};

export default function Canvas({
    activeTool,
    activeStyle,
    isSaved,
    isGoBack,
    onSelectTool,
    onSaveable,
    onSaveItem,
    onGoBack,
}: CanvasProps): ReactElement {
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
            onSaveable(false);

            setText("");

            onSelectTool(null);
        }

        window.addEventListener("keydown", handleWindowKeyDown);

        return () => window.removeEventListener("keydown", handleWindowKeyDown);
    }, [onSelectTool, resetDrag, setSelectArea, onSaveable]);

    useEffect(() => {
        function handleElementSave() {
            if (!isSaved) return;

            onSaveItem(false);

            if (!toolArea || !activeTool) return;

            const item: CanvasItem = {
                id: crypto.randomUUID(),
                type: activeTool,
                text: text,
                style: activeStyle ?? defaultStyle,
                area: toolArea,
            };

            setItems((current) => [...(current ?? []), item]);

            setToolArea(null);
            onSaveable(false);

            setText("");
        }

        handleElementSave();
    }, [
        activeStyle,
        activeTool,
        isSaved,
        onSaveItem,
        text,
        toolArea,
        onSaveable,
    ]);

    useEffect(() => {
        function handleToolArea() {
            if (!activeTool || !selectArea) return;

            setToolArea(selectArea);
            onSaveable(true);

            setSelectArea(null);
        }

        handleToolArea();
    }, [activeTool, selectArea, onSaveable]);

    useEffect(() => {
        function handleGoBack() {
            if (!isGoBack) return;

            onGoBack(false);
            onSelectTool(null);

            if (!toolArea) return;

            setSelectArea(toolArea);

            setToolArea(null);
            onSaveable(false);
        }

        handleGoBack();
    }, [isGoBack, onGoBack, onSelectTool, toolArea, onSaveable]);

    function getCanvasDot(e: React.PointerEvent<HTMLDivElement>): Dot | null {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();

        return {
            x: service.snapToGrid(e.clientX - rect.left, rect.width),
            y: service.snapToGrid(e.clientY - rect.top, rect.height),
        };
    }

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

        if (activeTool) {
            setToolArea(area);
            onSaveable(true);
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

        const nextDot = getCanvasDot(e);
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
            {toolArea && activeTool === "text" && (
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onPointerDown={(e) => e.stopPropagation()}
                    className={
                        activeTool
                            ? `${styles[activeTool]} ${styles.activeTool}`
                            : undefined
                    }
                    style={{
                        ...defaultStyle,
                        ...(activeStyle ?? {}),
                        ...(toolArea ?? {}),
                    }}
                />
            )}
            {toolArea && activeTool === "image" && (
                <div
                    className={
                        activeTool
                            ? `${styles[activeTool]} ${styles.activeTool}`
                            : undefined
                    }
                    style={{ ...(toolArea ?? {}) }}
                />
            )}
            {displayItems}
        </div>
    );
}
