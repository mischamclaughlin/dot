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

    function getNextPos(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const offset = GRID_SIZE / 2;

        const nextPos: DotSelection = {
            x: Math.round((x - offset) / GRID_SIZE) * GRID_SIZE + offset,
            y: Math.round((y - offset) / GRID_SIZE) * GRID_SIZE + offset,
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

    return (
        <>
            <div
                className={styles.dotGrid}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
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
