import React, {
    type ReactElement,
    useCallback,
    useEffect,
    useState,
} from "react";

import type {
    AreaStyle,
    CanvasItem,
    CanvasTool,
    Dot,
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
    onSaveItem: (isSaved: boolean) => void;
    onGoBack: (isBack: boolean) => void;
};

export default function Canvas({
    activeTool,
    activeStyle,
    isSaved,
    isGoBack,
    onSelectTool,
    onSaveItem,
    onGoBack,
}: CanvasProps): ReactElement {
    const service = new DotGridService();

    const [isDragging, setIsDragging] = useState<boolean>(false);

    const [hoverDot, setHoverDot] = useState<Dot | null>(null);
    const [dragStartDot, setDragStartDot] = useState<Dot | null>(null);

    const [draftArea, setDraftArea] = useState<SelectionArea | null>(null);
    const [selectArea, setSelectArea] = useState<SelectionArea | null>(null);
    const [toolArea, setToolArea] = useState<SelectionArea | null>(null);

    const [text, setText] = useState("");

    const [items, setItems] = useState<CanvasItem[] | null>(null);

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

            setText("");

            onSelectTool(null);
        }

        window.addEventListener("keydown", handleWindowKeyDown);

        return () => window.removeEventListener("keydown", handleWindowKeyDown);
    }, [onSelectTool, resetDrag, setSelectArea]);

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
            setText("");
        }

        handleElementSave();
    }, [activeStyle, activeTool, isSaved, onSaveItem, text, toolArea]);

    useEffect(() => {
        function handleToolArea() {
            if (!activeTool || !selectArea) return;

            setToolArea(selectArea);
            setSelectArea(null);
        }

        handleToolArea();
    }, [activeTool, selectArea]);

    useEffect(() => {
        function handleGoBack() {
            if (!isGoBack) return;

            onGoBack(false);
            onSelectTool(null);

            if (!toolArea) return;

            setSelectArea(toolArea);
            setToolArea(null);
        }

        handleGoBack();
    }, [isGoBack, onGoBack, onSelectTool, toolArea]);

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

        if (activeTool) setToolArea(area);
        else setSelectArea(area);
    }

    function handlePointerCancel() {
        resetDrag();
    }

    const displayItems =
        items?.map((item) => {
            return (
                <div
                    key={item.id}
                    className={styles.savedElement}
                    style={{ ...item.style, ...item.area }}
                >
                    {item.text}
                </div>
            );
        }) ?? null;

    return (
        <div
            className={styles.container}
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
