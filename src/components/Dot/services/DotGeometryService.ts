import type { RefObject } from "react";
import type { SingleDot } from "../types/DotTypes";
// -----------------------------------------------------------------------------

export class DotGeometryService {
    readonly gridSize: number;

    constructor(gridSize: number = 15) {
        this.gridSize = gridSize;
    }

    snapToGrid(value: number, maxValue: number) {
        const offset = this.gridSize / 2;
        const snapped =
            Math.round((value - offset) / this.gridSize) * this.gridSize +
            offset;
        const maxGridActiveDot =
            Math.floor((maxValue - offset) / this.gridSize) * this.gridSize +
            offset;

        return Math.min(
            Math.max(snapped, offset),
            Math.max(offset, maxGridActiveDot),
        );
    }

    updateTempArea(start: SingleDot, end: SingleDot) {
        const minX = Math.min(start.x, end.x);
        const maxX = Math.max(start.x, end.x);
        const minY = Math.min(start.y, end.y);
        const maxY = Math.max(start.y, end.y);

        const left = minX - this.gridSize / 2;
        const top = minY - this.gridSize / 2;
        const width = maxX - minX + this.gridSize;
        const height = maxY - minY + this.gridSize;

        return {
            left: left,
            top: top,
            width: width,
            height: height,
        };
    }

    isSameDot(dot: SingleDot | null, nextDot: SingleDot | null) {
        return dot?.x === nextDot?.x && dot?.y === nextDot?.y;
    }

    updateItemWidth(start: SingleDot, end: SingleDot) {
        const minX = Math.min(start.x, end.x);
        const maxX = Math.max(start.x, end.x);

        const left = minX - this.gridSize / 2;
        const width = maxX - minX + this.gridSize;

        return {
            left: left,
            width: width,
        };
    }

    updateItemHeight(start: SingleDot, end: SingleDot) {
        const minY = Math.min(start.y, end.y);
        const maxY = Math.max(start.y, end.y);

        const top = minY - this.gridSize / 2;
        const height = maxY - minY + this.gridSize;

        return {
            top: top,
            height: height,
        };
    }

    getCanvasDot(
        e: React.PointerEvent<HTMLDivElement>,
        canvasRef: RefObject<HTMLDivElement | null>,
    ): SingleDot | null {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();

        return {
            x: this.snapToGrid(e.clientX - rect.left, rect.width),
            y: this.snapToGrid(e.clientY - rect.top, rect.height),
        };
    }
}
