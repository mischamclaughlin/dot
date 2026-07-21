import type { Dot } from "../types/DotGridTypes";

export class DotGridService {
    gridSize: number;

    constructor(gridSize: number = 15) {
        this.gridSize = gridSize;
    }

    isSameDot(dot: Dot | null, nextDot: Dot) {
        return dot?.x === nextDot.x && dot.y === nextDot.y;
    }

    getNextActiveDot(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const nextactiveDot: Dot = {
            x: this.snapToGrid(x, rect.width),
            y: this.snapToGrid(y, rect.height),
        };

        return nextactiveDot;
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
}
