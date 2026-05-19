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

export function getOptionsRect(bounds: Bounds, metrics: GridMetrics) {
    const gridLeftOffset = Math.max(
        0,
        (metrics.containerWidth - metrics.cols * metrics.cellSize) / 2,
    );

    const gridTopOffset = Math.max(
        0,
        (metrics.containerHeight - metrics.rows * metrics.cellSize) / 2,
    );

    let left: number = gridLeftOffset + bounds.left * metrics.cellSize;
    let top: number =
        gridTopOffset +
        bounds.top * metrics.cellSize +
        (bounds.bottom - bounds.top + 1.25) * metrics.cellSize;
    let width: number = Math.max(
        175,
        (bounds.right - bounds.left) * metrics.cellSize,
    );
    let height: number = 40;

    if (metrics.containerWidth < 240) {
        width = metrics.cellSize * 4;
        height = metrics.cellSize * 4;

        const rightEdge = left + width;
        if (rightEdge > metrics.containerWidth) {
            left -= metrics.cellSize * 3;
        }

        const bottomEdge = top + height;
        if (bottomEdge + 20 > metrics.containerHeight) {
            top -= metrics.cellSize * 5 + 10;
        }
    } else {
        const rightEdge = left + width;
        if (rightEdge > metrics.containerWidth) {
            left = gridLeftOffset + bounds.left * metrics.cellSize - width + 20;
        }

        const bottomEdge = top + height;
        if (bottomEdge + 20 > metrics.containerHeight) {
            top =
                gridTopOffset +
                bounds.top * metrics.cellSize -
                (bounds.bottom - bounds.top) * metrics.cellSize - 45;
        }
    }

    return {
        left: left,
        top: top,
        width: width,
        height: height,
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
