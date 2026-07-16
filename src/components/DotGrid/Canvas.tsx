import React, { type ReactElement, useEffect, useState } from "react";

import type {
    AreaStyle,
    CanvasTool,
    Dot,
    CanvasItem,
    SelectionArea,
} from "./types/DotGridTypes";

import { GRID_SIZE } from "./DotGrid";

import styles from "./Canvas.module.css";
import { DotGridService } from "./services/DotGridService";

type CanvasProps = {
    activeTool: CanvasTool;
    onDeselectTool: () => void;
    activeStyle: AreaStyle | null;
    isSaved: boolean;
    onSavedElement: (isSaved: boolean) => void;
};

export default function Canvas({
    activeTool,
    onDeselectTool,
    activeStyle,
    isSaved,
    onSavedElement,
}: CanvasProps): ReactElement {
    const service = new DotGridService();

    const [isDragging, setIsDragging] = useState<boolean>(false);

    const [hoverDot, setHoverDot] = useState<Dot | null>(null);
    const [dragStartDot, setDragStartDot] = useState<Dot | null>(null);

    const [draftArea, setDraftArea] = useState<SelectionArea | null>(null);
    const [selectArea, setSelectArea] = useState<SelectionArea | null>(null);
    const [toolArea, setToolArea] = useState<SelectionArea | null>(null);

    const [items, setItems] = useState<CanvasItem[] | null>(null);

    const [text, setText] = useState("");

    useEffect(() => {
        function handleWindowKeyDown(e: KeyboardEvent) {
            if (e.key !== "Escape") return;

            setIsDragging(false);
            setDragStartDot(null);
            setDraftArea(null);
            setSelectArea(null);
            onDeselectTool();
        }

        window.addEventListener("keydown", handleWindowKeyDown);

        return () => window.removeEventListener("keydown", handleWindowKeyDown);
    }, [setSelectArea, onDeselectTool]);

    useEffect(() => {
        function handleElementSave() {
            if (!isSaved) return;

            const item: CanvasItem = {
                id: crypto.randomUUID(),
                type: activeTool,
                text: text,
                style: activeStyle,
                area: toolArea,
            };

            setItems((current) => [...(current ?? []), item]);

            onSavedElement(false);
            setToolArea(null);
            setText("");
        }

        handleElementSave();
    }, [activeStyle, activeTool, isSaved, onSavedElement, text, toolArea]);

    useEffect(() => {
        function handleToolArea() {
            if (!activeTool || !selectArea) return;

            setToolArea(selectArea);
            setSelectArea(null);
        }

        handleToolArea();
    }, [activeTool, selectArea]);

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const nextactiveDot = service.getNextActiveDot(e);

        if (service.isSameDot(hoverDot, nextactiveDot)) return;

        setHoverDot(nextactiveDot);

        if (!isDragging || !dragStartDot) return;

        const area = service.updateTempArea(dragStartDot, nextactiveDot);
        setDraftArea(area);
    }

    function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
        const nextActiveDot = service.getNextActiveDot(e);

        setIsDragging(true);
        setSelectArea(null);
        setDragStartDot(nextActiveDot);
    }

    function handleMouseUp() {
        const area = draftArea;

        setIsDragging(false);
        setDragStartDot(null);
        setDraftArea(null);

        if (!area) return;

        if (activeTool) setToolArea(area);
        else setSelectArea(area);
    }

    const displayItems =
        items?.map((element) => {
            const props = service.createElementProps(element);

            return (
                <div
                    key={element.id}
                    className={styles.savedElement}
                    style={props.style}
                >
                    {props.text}
                </div>
            );
        }) ?? null;

    return (
        <>
            <div
                className={styles.container}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                style={{ backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px` }}
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
                    <div
                        className={styles.draftArea}
                        style={{
                            left: draftArea.left,
                            top: draftArea.top,
                            width: draftArea.width,
                            height: draftArea.height,
                        }}
                    />
                )}
                {selectArea && (
                    <div
                        className={styles.selectArea}
                        style={{
                            left: selectArea.left,
                            top: selectArea.top,
                            width: selectArea.width,
                            height: selectArea.height,
                        }}
                    />
                )}
                {toolArea && activeTool === "text" && (
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onMouseDown={(e) => e.stopPropagation()}
                        onMouseUp={(e) => e.stopPropagation()}
                        className={
                            activeTool
                                ? `${styles[activeTool]} ${styles.activeTool}`
                                : undefined
                        }
                        style={{
                            left: toolArea.left,
                            top: toolArea.top,
                            width: toolArea.width,
                            height: toolArea.height,
                            fontSize: activeStyle
                                ? service.updateStyleVariant(activeStyle)
                                      .fontSize
                                : undefined,
                            fontWeight: activeStyle
                                ? service.updateStyleVariant(activeStyle)
                                      .fontWeight
                                : undefined,
                            textAlign: activeStyle
                                ? service.updateStyleAlign(activeStyle)
                                      .textAlign
                                : undefined,
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
                        style={{
                            left: toolArea.left,
                            top: toolArea.top,
                            width: toolArea.width,
                            height: toolArea.height,
                        }}
                    />
                )}
                {displayItems}
            </div>
        </>
    );
}
