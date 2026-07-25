import { describe, expect, it } from "vitest";

import type { AreaStyle } from "../types/DotGridTypes";

import { DotGridService } from "./DotGridService";
import type React from "react";

describe("DotGridService", () => {
    const dot = { x: 22.5, y: 35.5 };
    const diffDot = { x: 52.5, y: 100.5 };

    describe("snapToGrid", () => {
        const service = new DotGridService(15);

        it("snaps values to the grid", () => {
            expect(service.snapToGrid(0, 300)).toBe(7.5);
            expect(service.snapToGrid(16, 300)).toBe(22.5);
        });
        it("clamps to first valid center", () => {
            expect(service.snapToGrid(-20, 300)).toBe(7.5);
        });
        it("clamps to upper-bound", () => {
            expect(service.snapToGrid(99999, 300)).toBe(292.5);
        });
        it("clamps to maximum valid center", () => {
            expect(service.snapToGrid(291, 300)).toBe(292.5);
            expect(service.snapToGrid(299, 300)).toBe(292.5);
        });
    });

    describe("updateTempArea", () => {
        const service = new DotGridService(15);

        const result = service.updateTempArea(dot, diffDot);

        it("builds an area from two dots", () => {
            expect(result).toEqual({
                height: 80,
                left: 15,
                top: 28,
                width: 45,
            });
        });
        it("returns a AreaStyle type object", () => {
            expectTypeOf(result).toEqualTypeOf<AreaStyle>();
        });
    });

    describe("isSameDot", () => {
        const service = new DotGridService(15);

        it("returns true if selected dots are the same", () => {
            expect(service.isSameDot(dot, dot)).toBe(true);
        });
        it("returns false if selected dots are not the same", () => {
            expect(service.isSameDot(dot, diffDot)).toBe(false);
        });
    });

    describe("updateItemWidth", () => {
        const service = new DotGridService(15);

        const dotSmallX = { x: 22.5, y: 0 };
        const dotBigX = { x: 52.5, y: 0 };

        it("returns width when end `X` is greater than start `X`", () => {
            const result = service.updateItemWidth(dotSmallX, dotBigX);

            expect(result).toEqual({
                left: 15,
                width: 45,
            });
        });
        it("returns same width when dragging in reverse direction", () => {
            const result = service.updateItemWidth(dotBigX, dotSmallX);

            expect(result).toEqual({
                left: 15,
                width: 45,
            });
        });
        it("returns one cell width when start and end `X` are equal", () => {
            const result = service.updateItemWidth(dotSmallX, dotSmallX);

            expect(result).toEqual({
                left: 15,
                width: 15,
            });
        });
    });

    describe("updateItemHeight", () => {
        const service = new DotGridService(15);

        const dotSmallY = { x: 0, y: 35.5 };
        const dotBigY = { x: 0, y: 100.5 };

        it("returns height when end `Y` is greater than start `Y`", () => {
            const result = service.updateItemHeight(dotSmallY, dotBigY);

            expect(result).toEqual({
                height: 80,
                top: 28,
            });
        });
        it("returns same height when dragging in reverse direction", () => {
            const result = service.updateItemHeight(dotBigY, dotSmallY);

            expect(result).toEqual({
                height: 80,
                top: 28,
            });
        });
        it("returns one cell height when start and end `Y` are equal", () => {
            const result = service.updateItemHeight(dotSmallY, dotSmallY);

            expect(result).toEqual({
                height: 15,
                top: 28,
            });
        });
    });

    describe("getCanvasDot", () => {
        const service = new DotGridService(15);

        const fakeEvent = {} as React.PointerEvent<HTMLDivElement>;
        const nullCanvasRef = {
            current: null,
        } as React.RefObject<HTMLDivElement | null>;

        it("returns null", () => {
            const result = service.getCanvasDot(fakeEvent, nullCanvasRef);

            expect(result).toBeNull();
        });
    });

    describe("getNextActiveDot", () => {
        const service = new DotGridService(15);

        it("translates client coordinates to snapped canvas dot", () => {
            const element = document.createElement("div");

            Object.defineProperty(element, "getBoundingClientRect", {
                value: () =>
                    ({
                        left: 100,
                        top: 50,
                        width: 300,
                        height: 300,
                        right: 400,
                        bottom: 350,
                        x: 100,
                        y: 50,
                        toJSON: () => ({}),
                    }) as DOMRect,
            });

            const event = {
                clientX: 116,
                clientY: 66,
                currentTarget: element,
            } as unknown as React.PointerEvent<HTMLDivElement>;

            const result = service.getNextActiveDot(event);

            expect(result).toEqual({
                x: 22.5,
                y: 22.5,
            });
        });
    });
});
