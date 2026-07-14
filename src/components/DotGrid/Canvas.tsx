import React, { useEffect, useState, type ReactElement } from "react";
import styles from "./Canvas.module.css";
import type { CanvasTool } from "./DotGrid";

export const GRID_SIZE = 15;

type DotSelection = { x: number; y: number };

type SelectionArea = {
    left: number;
    top: number;
    width: number;
    height: number;
};

type CanvasProps = {
    activeTool: CanvasTool;
};

export default function Canvas({ activeTool }: CanvasProps): ReactElement {
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

    const [activeDot, setActiveDot] = useState<DotSelection | null>(null);
    const [startArea, setStartArea] = useState<DotSelection | null>(null);

    const [tempArea, setTempArea] = useState<SelectionArea | null>(null);
    const [activeArea, setActiveArea] = useState<SelectionArea | null>(null);

    useEffect(() => {
        function handleWindowKeyDown(e: KeyboardEvent) {
            if (e.key !== "Escape") return;

            setIsMouseDown(false);
            setStartArea(null);
            setTempArea(null);
            setActiveArea(null);
        }

        window.addEventListener("keydown", handleWindowKeyDown);

        return () => window.removeEventListener("keydown", handleWindowKeyDown);
    }, []);

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

    function isSameDot(dot: DotSelection | null, nextDot: DotSelection) {
        return dot?.x === nextDot.x && dot.y === nextDot.y;
    }

    function getNextactiveDot(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const nextactiveDot: DotSelection = {
            x: snapToGrid(x, rect.width),
            y: snapToGrid(y, rect.height),
        };

        return nextactiveDot;
    }

    function updateTempArea(start: DotSelection, end: DotSelection) {
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
                className={styles.dotGrid}
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
            </div>
        </>
    );
}
