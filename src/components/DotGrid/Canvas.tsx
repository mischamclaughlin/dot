import React, { type ReactElement, useEffect, useState } from "react";

import type {
    AreaStyle,
    CanvasTool,
    Dot,
    SelectionArea,
} from "./types/DotGridTypes";
import { GRID_SIZE } from "./DotGrid";

import styles from "./Canvas.module.css";
import {
    alignCenter,
    alignJustify,
    alignLeft,
    alignRight,
    variantHeading,
    variantBody,
    variantSubHeading,
    variantSubTitle,
    variantTitle,
} from "./styles/DotGridStyles";

type CanvasProps = {
    activeTool: CanvasTool;
    activeArea: SelectionArea | null;
    setActiveArea: React.Dispatch<React.SetStateAction<SelectionArea | null>>;
    toolArea: SelectionArea | null;
    onDeselectTool: () => void;
    activeStyle: AreaStyle | null;
};

export default function Canvas({
    activeTool,
    activeArea,
    setActiveArea,
    toolArea,
    onDeselectTool,
    activeStyle,
}: CanvasProps): ReactElement {
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

    const [activeDot, setActiveDot] = useState<Dot | null>(null);
    const [startArea, setStartArea] = useState<Dot | null>(null);

    const [tempArea, setTempArea] = useState<SelectionArea | null>(null);

    function updateStyleVariant(style: AreaStyle) {
        if (style.variant === "title") return variantTitle;
        if (style.variant === "subTitle") return variantSubTitle;
        if (style.variant === "heading") return variantHeading;
        if (style.variant === "subHeading") return variantSubHeading;

        return variantBody;
    }

    function updateStyleAlign(style: AreaStyle) {
        if (style.align === "right") return alignRight.textAlign;
        if (style.align === "center") return alignCenter.textAlign;
        if (style.align === "justify") return alignJustify.textAlign;

        return alignLeft.textAlign;
    }

    useEffect(() => {
        function handleWindowKeyDown(e: KeyboardEvent) {
            if (e.key !== "Escape") return;

            setIsMouseDown(false);
            setStartArea(null);
            setTempArea(null);
            setActiveArea(null);
            onDeselectTool();
        }

        window.addEventListener("keydown", handleWindowKeyDown);

        return () => window.removeEventListener("keydown", handleWindowKeyDown);
    }, [setActiveArea, onDeselectTool]);

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const nextactiveDot = getNextactiveDot(e);

        if (isSameDot(activeDot, nextactiveDot)) return;

        setActiveDot(nextactiveDot);

        if (!isMouseDown || !startArea) return;
        updateTempArea(startArea, nextactiveDot);
    }

    function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
        const nextactiveDot = getNextactiveDot(e);

        setIsMouseDown(true);
        setActiveArea(null);
        setStartArea(nextactiveDot);
        setActiveDot(nextactiveDot);
    }

    function handleMouseUp() {
        setIsMouseDown(false);
        setStartArea(null);
        setActiveArea(tempArea);
        setTempArea(null);
    }

    function snapToGrid(value: number, maxValue: number) {
        const offset = GRID_SIZE / 2;
        const snapped =
            Math.round((value - offset) / GRID_SIZE) * GRID_SIZE + offset;
        const maxGridactiveDot =
            Math.floor((maxValue - offset) / GRID_SIZE) * GRID_SIZE + offset;

        return Math.min(
            Math.max(snapped, offset),
            Math.max(offset, maxGridactiveDot),
        );
    }

    function isSameDot(dot: Dot | null, nextDot: Dot) {
        return dot?.x === nextDot.x && dot.y === nextDot.y;
    }

    function getNextactiveDot(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const nextactiveDot: Dot = {
            x: snapToGrid(x, rect.width),
            y: snapToGrid(y, rect.height),
        };

        return nextactiveDot;
    }

    function updateTempArea(start: Dot, end: Dot) {
        const minX = Math.min(start.x, end.x);
        const maxX = Math.max(start.x, end.x);
        const minY = Math.min(start.y, end.y);
        const maxY = Math.max(start.y, end.y);

        const left = minX - GRID_SIZE / 2;
        const top = minY - GRID_SIZE / 2;
        const width = maxX - minX + GRID_SIZE;
        const height = maxY - minY + GRID_SIZE;

        setTempArea({
            left: left,
            top: top,
            width: width,
            height: height,
        });
    }

    return (
        <>
            <div
                className={styles.container}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
            >
                {activeDot && (
                    <div
                        className={styles.activeDot}
                        style={{ left: activeDot.x, top: activeDot.y }}
                    />
                )}
                {tempArea && (
                    <div
                        className={styles.tempArea}
                        style={{
                            left: tempArea.left,
                            top: tempArea.top,
                            width: tempArea.width,
                            height: tempArea.height,
                        }}
                    />
                )}
                {activeArea && (
                    <div
                        className={styles.activeArea}
                        style={{
                            left: activeArea.left,
                            top: activeArea.top,
                            width: activeArea.width,
                            height: activeArea.height,
                        }}
                    />
                )}
                {toolArea && activeTool === "text" && (
                    <textarea
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
                                ? updateStyleVariant(activeStyle).fontSize
                                : undefined,
                            fontWeight: activeStyle
                                ? updateStyleVariant(activeStyle).fontWeight
                                : undefined,
                            textAlign: activeStyle
                                ? updateStyleAlign(activeStyle)
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
            </div>
        </>
    );
}
