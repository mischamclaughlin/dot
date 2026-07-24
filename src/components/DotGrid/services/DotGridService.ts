import type { RefObject } from "react";
import type { Dot } from "../types/DotGridTypes";

export class DotGridService {
    readonly gridSize: number;

    constructor(gridSize: number = 15) {
        this.gridSize = gridSize;
    }

    isSameDot(dot: Dot | null, nextDot: Dot) {
        return dot?.x === nextDot.x && dot.y === nextDot.y;
    }

    getNextActiveDot(e: React.PointerEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const nextActiveDot: Dot = {
            x: this.snapToGrid(x, rect.width),
            y: this.snapToGrid(y, rect.height),
        };

        return nextActiveDot;
    }

    snapToGrid(value: number, maxValue: number) {
        const offset = this.gridSize / 2;
        const snapped =
            Math.round((value - offset) / this.gridSize) * this.gridSize +
            offset;
        const maxGridactiveDot =
            Math.floor((maxValue - offset) / this.gridSize) * this.gridSize +
            offset;

        return Math.min(
            Math.max(snapped, offset),
            Math.max(offset, maxGridactiveDot),
        );
    }

    updateTempArea(start: Dot, end: Dot) {
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

    updateItemWidth(start: Dot, end: Dot) {
        const minX = Math.min(start.x, end.x);
        const maxX = Math.max(start.x, end.x);

        const left = minX - this.gridSize / 2;
        const width = maxX - minX + this.gridSize;

        return {
            left: left,
            width: width,
        };
    }

    updateItemHeight(start: Dot, end: Dot) {
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
    ): Dot | null {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();

        return {
            x: this.snapToGrid(e.clientX - rect.left, rect.width),
            y: this.snapToGrid(e.clientY - rect.top, rect.height),
        };
    }
}
