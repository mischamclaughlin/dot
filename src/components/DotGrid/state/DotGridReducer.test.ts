import { describe, expect, it } from "vitest";

import type { CanvasTool, SelectionArea } from "../types/DotGridTypes";

import { dotGridReducer, initialState } from "./DotGridReducer";
import { contentAlignCenter, defaultStyle } from "../styles/DotGridStyles";

describe("dotGridReducer", () => {
    const area = {
        left: 0,
        top: 0,
        width: 30,
        height: 30,
    } as SelectionArea;
    const id = crypto.randomUUID();
    const text = "hello" as string;
    const tool = "text" as CanvasTool;

    const canvasItems = [
        {
            area: area,
            id: id,
            style: defaultStyle,
            text: text,
            type: tool,
        },
    ];

    describe("area/", () => {
        it("sets the selected area", () => {
            const result = dotGridReducer(initialState, {
                type: "area/selected",
                payload: area,
            });

            expect(result).toStrictEqual({
                ...initialState,
                activeArea: area,
            });
        });

        it("sets the selected area to the tool area", () => {
            const state = {
                ...initialState,
                activeArea: area,
            };

            const result = dotGridReducer(state, {
                type: "area/tool",
                payload: area,
            });

            expect(result).toStrictEqual({
                ...initialState,
                toolArea: area,
                activeArea: null,
            });
        });
    });

    describe("editing/", () => {
        it("goes back to tool selection", () => {
            const state = {
                ...initialState,
                activeArea: null,
                toolArea: area,
                tool: tool,
                itemText: text,
            };

            const result = dotGridReducer(state, { type: "editing/back" });

            expect(result).toStrictEqual({
                ...initialState,
                activeArea: state.toolArea,
                toolArea: null,
                tool: null,
                itemText: "",
            });
        });

        it("cancels and resets current editing", () => {
            const result = dotGridReducer(initialState, {
                type: "editing/cancel",
            });

            expect(result).toStrictEqual({
                ...initialState,
                tool: null,
                activeArea: null,
                toolArea: null,
                itemText: "",
            });
        });
    });

    describe("item/", () => {
        describe("item/resize", () => {
            it("resizes a saved item", () => {
                const state = {
                    ...initialState,
                    canvasItems: canvasItems,
                };

                const result = dotGridReducer(state, {
                    type: "item/resize",
                    payload: {
                        id: id,
                        nextArea: { left: 15, width: 45 },
                    },
                });

                expect(result).toStrictEqual({
                    ...initialState,
                    canvasItems: [
                        {
                            ...canvasItems[0],
                            area: {
                                ...canvasItems[0].area,
                                left: 15,
                                top: 0,
                                width: 45,
                                height: 30,
                            },
                        },
                    ],
                });
            });

            it("returns the current state when resizing a missing item", () => {
                const state = {
                    ...initialState,
                    canvasItems: canvasItems,
                };

                const result = dotGridReducer(state, {
                    type: "item/resize",
                    payload: {
                        id: crypto.randomUUID(),
                        nextArea: { left: 15, width: 45 },
                    },
                });

                expect(result).toStrictEqual(state);
            });
        });

        describe("item/save", () => {
            it("returns the current state when there is no tool", () => {
                const state = {
                    ...initialState,
                    toolArea: area,
                    itemText: text,
                };

                const result = dotGridReducer(state, {
                    type: "item/save",
                    payload: id,
                });

                expect(result).toStrictEqual(state);
            });

            it("returns the current state when there is no tool area", () => {
                const state = {
                    ...initialState,
                    tool: tool,
                    itemText: text,
                };

                const result = dotGridReducer(state, {
                    type: "item/save",
                    payload: id,
                });

                expect(result).toStrictEqual(state);
            });

            it("saves an item into canvasItems", () => {
                const state = {
                    ...initialState,
                    tool: tool,
                    toolArea: area,
                    itemText: text,
                };

                const result = dotGridReducer(state, {
                    type: "item/save",
                    payload: id,
                });

                expect(result.canvasItems).toHaveLength(1);
                expect(result).toStrictEqual({
                    ...initialState,
                    canvasItems: [
                        {
                            area: area,
                            id: id,
                            style: defaultStyle,
                            text: text,
                            type: tool,
                        },
                    ],
                    lastSavedItemId: id,
                    tool: tool,
                    toolArea: null,
                    itemText: "",
                });
            });
        });

        it("saves an items style", () => {
            const result = dotGridReducer(initialState, {
                type: "item/style",
                payload: { ...contentAlignCenter },
            });

            expect(result).toStrictEqual({
                ...initialState,
                itemStyle: {
                    ...defaultStyle,
                    alignContent: "center",
                },
            });
        });

        it("saves an items text", () => {
            const result = dotGridReducer(initialState, {
                type: "item/text",
                payload: text,
            });

            expect(result).toStrictEqual({
                ...initialState,
                itemText: text,
            });
        });
    });

    describe("tool/", () => {
        it("activates a tool", () => {
            const result = dotGridReducer(initialState, {
                type: "tool/selected",
                payload: tool,
            });

            expect(result.tool).toBe(tool);
        });
    });
});
