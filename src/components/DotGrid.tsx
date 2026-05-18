import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { dotGridTheme, cssVars } from "./dotGridTheme";
import styles from "./DotGrid.module.css";

type Cell = {
    row: number;
    col: number;
};

type Bounds = {
    top: number;
    bottom: number;
    left: number;
    right: number;
};

function getBounds(start: Cell, end: Cell): Bounds {
    return {
        top: Math.min(start.row, end.row),
        bottom: Math.max(start.row, end.row),
        left: Math.min(start.col, end.col),
        right: Math.max(start.col, end.col),
    };
}

function isInBounds(row: number, col: number, bounds: Bounds | null) {
    if (bounds === null) return false;

    return (
        row >= bounds.top &&
        row <= bounds.bottom &&
        col >= bounds.left &&
        col <= bounds.right
    );
}

export default function DotGrid() {
    const ref = useRef<HTMLDivElement | null>(null);

    const [rows, setRows] = useState<number>(0);
    const [cols, setCols] = useState<number>(0);
    const [firstCell, setFirstCell] = useState<Cell | null>(null);
    const [dragCell, setDragCell] = useState<Cell | null>(null);
    const [activeCells, setActiveCells] = useState<Bounds | null>(null);
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

    const previewCells = useMemo(() => {
        if (!isMouseDown || firstCell === null || dragCell === null)
            return activeCells;

        return getBounds(firstCell, dragCell);
    }, [isMouseDown, firstCell, dragCell, activeCells]);

    useLayoutEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;

            setRows(Math.floor(height / dotGridTheme.cellSize));
            setCols(Math.floor(width / dotGridTheme.cellSize));
        });

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    function handleMouseDown(row: number, col: number) {
        const cell = { row, col };

        setFirstCell(cell);
        setDragCell(cell);
        setIsMouseDown(true);
    }

    function handleMouseEnter(row: number, col: number) {
        if (!isMouseDown) return;

        setDragCell({ row, col });
    }

    function handleMouseUp(row: number, col: number) {
        if (firstCell !== null)
            setActiveCells(getBounds(firstCell, { row, col }));

        setIsMouseDown(false);
        setDragCell(null);
    }

    function viewGrid() {
        return Array.from({ length: rows }).map((_, row) => (
            <div className={styles.row} key={`${row}`}>
                {Array.from({ length: cols }).map((_, col) => {
                    const cellId = `${row}-${col}`;

                    return (
                        <div
                            className={[
                                styles.cell,
                                isInBounds(row, col, previewCells)
                                    ? styles.activeCell
                                    : "",
                            ].join(" ")}
                            key={cellId}
                            onMouseDown={() => handleMouseDown(row, col)}
                            onMouseEnter={() => handleMouseEnter(row, col)}
                            onMouseUp={() => handleMouseUp(row, col)}
                        >
                            <div className={styles.dot} />
                        </div>
                    );
                })}
            </div>
        ));
    }

    return (
        <>
            <div className={styles.pageContainer} style={cssVars} ref={ref}>
                {viewGrid()}
            </div>
        </>
    );
}
