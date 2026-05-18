export type Cell = {
    row: number;
    col: number;
};

export type Bounds = {
    top: number;
    bottom: number;
    left: number;
    right: number;
};

type GridMetrics = {
    containerWidth: number;
    containerHeight: number;
    rows: number;
    cols: number;
    cellSize: number;
};

export function getBounds(start: Cell, end: Cell): Bounds {
    return {
        top: Math.min(start.row, end.row),
        bottom: Math.max(start.row, end.row),
        left: Math.min(start.col, end.col),
        right: Math.max(start.col, end.col),
    };
}

export function getSelectionRect(bounds: Bounds, metrics: GridMetrics) {
    const gridLeftOffset = Math.max(
        0,
        (metrics.containerWidth - metrics.cols * metrics.cellSize) / 2,
    );

    const gridTopOffset = Math.max(
        0,
        (metrics.containerHeight - metrics.rows * metrics.cellSize) / 2,
    );

    return {
        left: gridLeftOffset + bounds.left * metrics.cellSize,
        top: gridTopOffset + bounds.top * metrics.cellSize,
        width: (bounds.right - bounds.left + 1) * metrics.cellSize,
        height: (bounds.bottom - bounds.top + 1) * metrics.cellSize,
    };
}

export function isInBounds(row: number, col: number, bounds: Bounds | null) {
    if (bounds === null) return false;

    return (
        row >= bounds.top &&
        row <= bounds.bottom &&
        col >= bounds.left &&
        col <= bounds.right
    );
}
