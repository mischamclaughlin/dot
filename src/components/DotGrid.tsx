import React, { useState, type ReactElement } from "react";
import styles from "./DotGrid.module.css";

export const GRID_SIZE = 15;

type DotSelection = { x: number; y: number };

export default function DotGrid(): ReactElement {
    const [startPos, setStartPos] = useState<DotSelection | null>(null);
    const [pos, setPos] = useState<DotSelection | null>(null);
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
    const [draftDots, setDraftDots] = useState<DotSelection[]>([]);
    const [selectedDots, setSelectedDots] = useState<DotSelection[]>([]);

    function snapToGrid(value: number, maxValue: number) {
        const offset = GRID_SIZE / 2;
        const snapped =
            Math.round((value - offset) / GRID_SIZE) * GRID_SIZE + offset;
        const maxGridPos =
            Math.floor((maxValue - offset) / GRID_SIZE) * GRID_SIZE + offset;

        return Math.min(
            Math.max(snapped, offset),
            Math.max(offset, maxGridPos),
        );
    }

    function isSameDot(dot: DotSelection | null, nextDot: DotSelection) {
        return dot?.x === nextDot.x && dot.y === nextDot.y;
    }

    function getNextPos(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const nextPos: DotSelection = {
            x: snapToGrid(x, rect.width),
            y: snapToGrid(y, rect.height),
        };

        return nextPos;
    }

    function getDotsInRange(start: DotSelection, end: DotSelection) {
        const minX = Math.min(start.x, end.x);
        const maxX = Math.max(start.x, end.x);
        const minY = Math.min(start.y, end.y);
        const maxY = Math.max(start.y, end.y);
        const dots: DotSelection[] = [];

        for (let x = minX; x <= maxX; x += GRID_SIZE) {
            for (let y = minY; y <= maxY; y += GRID_SIZE) {
                dots.push({ x, y });
            }
        }

        return dots;
    }

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const nextPos = getNextPos(e);

        if (isSameDot(pos, nextPos)) return;

        setPos(nextPos);

        if (!isMouseDown || !startPos) return;
        setDraftDots(getDotsInRange(startPos, nextPos));
    }

    function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
        const nextPos = getNextPos(e);

        setIsMouseDown(true);
        setSelectedDots([]);
        setStartPos(nextPos);
        setPos(nextPos);
        setDraftDots([nextPos]);
    }

    function handleMouseUp() {
        setIsMouseDown(false);
        setStartPos(null);
        setSelectedDots(draftDots);
        setDraftDots([]);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.key !== "Escape") return;

        setSelectedDots([]);
    }

    return (
        <>
            <div
                className={styles.dotGrid}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onKeyDown={handleKeyDown}
            >
                <div
                    className={styles.activeDot}
                    style={pos ? { left: pos.x, top: pos.y } : undefined}
                />
                {draftDots.map((dot) => (
                    <div
                        key={`${dot.x}-${dot.y}`}
                        className={styles.draftDot}
                        style={{ left: dot.x, top: dot.y }}
                    />
                ))}
                {selectedDots.map((dot) => (
                    <div
                        key={`${dot.x}-${dot.y}`}
                        className={styles.selectedDot}
                        style={{ left: dot.x, top: dot.y }}
                    />
                ))}
            </div>
        </>
    );
}
