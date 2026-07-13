import React, { useState, type ReactElement } from "react";
import styles from "./DotGrid.module.css";

export const GRID_SIZE = 15;

type DotSelection = { x: number; y: number };

export default function DotGrid(): ReactElement {
    const [pos, setPos] = useState<DotSelection>({ x: 0, y: 0 });
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
    const [draftDots, setDraftDots] = useState<DotSelection[]>([]);

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const offset = GRID_SIZE / 2;

        const nextPos: DotSelection = {
            x: Math.round((x - offset) / GRID_SIZE) * GRID_SIZE + offset,
            y: Math.round((y - offset) / GRID_SIZE) * GRID_SIZE + offset,
        };

        setPos(nextPos);

        if (!isMouseDown) return;

        setDraftDots((dots) => {
            const alreadyExists = dots.some(
                (dot) => dot.x === nextPos.x && dot.y === nextPos.y,
            );

            return alreadyExists ? dots : [...draftDots, pos];
        });
    }

    function handleMouseDown() {
        setDraftDots([...draftDots, pos]);
        setIsMouseDown(true);
    }

    function handleMouseUp() {
        setIsMouseDown(false);
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
                    style={{ left: pos.x, top: pos.y }}
                />
                {draftDots.map((dot) => (
                    <div
                        className={styles.draftDot}
                        style={{ left: dot.x, top: dot.y }}
                    />
                ))}
            </div>
        </>
    );
}
