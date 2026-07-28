import { describe, expect, it } from "vitest";

import type { AreaStyle, CanvasTool } from "../types/DotGridTypes";

import { contentAlignCenter, defaultStyle } from "../tool/TextTool/TextStyles";
import { squareDotReducer, initialState } from "./SquareDotReducer";
// -----------------------------------------------------------------------------

describe("squareDotReducer", () => {
    const area = {
        left: 0,
        top: 0,
        width: 30,
        height: 30,
    } as AreaStyle;
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
            const result = squareDotReducer(initialState, {
                type: "area/selected",
                payload: area,
            });

            expect(result).toStrictEqual({
                ...initialState,
                areaSelected: area,
            });
        });

        it("sets the selected area to the tool area", () => {
            const state = {
                ...initialState,
                areaSelected: area,
            };

            const result = squareDotReducer(state, {
                type: "area/tool",
                payload: area,
            });

            expect(result).toStrictEqual({
                ...initialState,
                toolArea: area,
                areaSelected: null,
            });
        });
    });

    describe("editing/", () => {
        it("goes back to tool selection", () => {
            const state = {
                ...initialState,
                areaSelected: null,
                toolArea: area,
                tool: tool,
                itemText: text,
            };

            const result = squareDotReducer(state, { type: "editing/back" });

            expect(result).toStrictEqual({
                ...initialState,
                areaSelected: state.toolArea,
                toolArea: null,
                tool: null,
                itemText: "",
            });
        });

        it("cancels and resets current editing", () => {
            const result = squareDotReducer(initialState, {
                type: "editing/cancel",
            });

            expect(result).toStrictEqual({
                ...initialState,
                tool: null,
                areaSelected: null,
                toolArea: null,
                itemText: "",
            });
        });

        describe("editing/item", () => {
            it("moves the selected canvas item into edit mode", () => {
                const selectedItem = canvasItems[0];
                const remainingItem = {
                    ...selectedItem,
                    id: crypto.randomUUID(),
                    text: "another item",
                };

                const state = {
                    ...initialState,
                    canvasItems: [selectedItem, remainingItem],
                };

                const result = squareDotReducer(state, {
                    type: "editing/item",
                    payload: selectedItem.id,
                });

                expect(result).toStrictEqual({
                    ...state,
                    canvasItems: [remainingItem],
                    editedCanvasItems: [selectedItem],
                    itemEdit: selectedItem,
                    tool: selectedItem.type,
                    toolArea: selectedItem.area,
                    itemStyle: selectedItem.style,
                    itemText: selectedItem.text,
                });
            });

            it("returns the current state when the selected item does not exist", () => {
                const state = {
                    ...initialState,
                    canvasItems,
                };

                const result = squareDotReducer(state, {
                    type: "editing/item",
                    payload: crypto.randomUUID(),
                });

                expect(result).toBe(state);
            });
        });
    });

    // describe("item/", () => {
    //     describe("item/padding*", () => {
    //         describe("item/paddingTop", () => {
    //             const state = {
    //                 ...initialState,
    //                 itemStyle: {
    //                     ...initialState.itemStyle,
    //                     paddingTop: 5,
    //                 },
    //             };

    //             it("adds padding", () => {
    //                 const result = squareDotReducer(state, {
    //                     type: "item/paddingTop",
    //                     payload: "up",
    //                 });

    //                 expect(result).toStrictEqual({
    //                     ...state,
    //                     itemStyle: {
    //                         ...initialState.itemStyle,
    //                         paddingTop: 6,
    //                     },
    //                 });
    //             });
    //             it("adds padding", () => {
    //                 const result = squareDotReducer(state, {
    //                     type: "item/paddingTop",
    //                     payload: "down",
    //                 });

    //                 expect(result).toStrictEqual({
    //                     ...state,
    //                     itemStyle: {
    //                         ...initialState.itemStyle,
    //                         paddingTop: 4,
    //                     },
    //                 });
    //             });
    //         });

    //         describe("item/paddingBottom", () => {
    //             const state = {
    //                 ...initialState,
    //                 itemStyle: {
    //                     ...initialState.itemStyle,
    //                     paddingBottom: 5,
    //                 },
    //             };

    //             it("adds padding", () => {
    //                 const result = squareDotReducer(state, {
    //                     type: "item/paddingBottom",
    //                     payload: "up",
    //                 });

    //                 expect(result).toStrictEqual({
    //                     ...state,
    //                     itemStyle: {
    //                         ...initialState.itemStyle,
    //                         paddingBottom: 6,
    //                     },
    //                 });
    //             });
    //             it("adds padding", () => {
    //                 const result = squareDotReducer(state, {
    //                     type: "item/paddingBottom",
    //                     payload: "down",
    //                 });

    //                 expect(result).toStrictEqual({
    //                     ...state,
    //                     itemStyle: {
    //                         ...initialState.itemStyle,
    //                         paddingBottom: 4,
    //                     },
    //                 });
    //             });
    //         });

    //         describe("item/paddingLeft", () => {
    //             const state = {
    //                 ...initialState,
    //                 itemStyle: {
    //                     ...initialState.itemStyle,
    //                     paddingLeft: 5,
    //                 },
    //             };

    //             it("adds padding", () => {
    //                 const result = squareDotReducer(state, {
    //                     type: "item/paddingLeft",
    //                     payload: "up",
    //                 });

    //                 expect(result).toStrictEqual({
    //                     ...state,
    //                     itemStyle: {
    //                         ...initialState.itemStyle,
    //                         paddingLeft: 6,
    //                     },
    //                 });
    //             });
    //             it("adds padding", () => {
    //                 const result = squareDotReducer(state, {
    //                     type: "item/paddingLeft",
    //                     payload: "down",
    //                 });

    //                 expect(result).toStrictEqual({
    //                     ...state,
    //                     itemStyle: {
    //                         ...initialState.itemStyle,
    //                         paddingLeft: 4,
    //                     },
    //                 });
    //             });
    //         });

    //         describe("item/paddingRight", () => {
    //             const state = {
    //                 ...initialState,
    //                 itemStyle: {
    //                     ...initialState.itemStyle,
    //                     paddingRight: 5,
    //                 },
    //             };

    //             it("adds padding", () => {
    //                 const result = squareDotReducer(state, {
    //                     type: "item/paddingRight",
    //                     payload: "up",
    //                 });

    //                 expect(result).toStrictEqual({
    //                     ...state,
    //                     itemStyle: {
    //                         ...initialState.itemStyle,
    //                         paddingRight: 6,
    //                     },
    //                 });
    //             });
    //             it("adds padding", () => {
    //                 const result = squareDotReducer(state, {
    //                     type: "item/paddingRight",
    //                     payload: "down",
    //                 });

    //                 expect(result).toStrictEqual({
    //                     ...state,
    //                     itemStyle: {
    //                         ...initialState.itemStyle,
    //                         paddingRight: 4,
    //                     },
    //                 });
    //             });
    //         });
    //     });

    describe("item/resize", () => {
        it("resizes a saved item", () => {
            const state = {
                ...initialState,
                canvasItems: canvasItems,
            };

            const result = squareDotReducer(state, {
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

            const result = squareDotReducer(state, {
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

            const result = squareDotReducer(state, {
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

            const result = squareDotReducer(state, {
                type: "item/save",
                payload: id,
            });

            expect(result).toStrictEqual(state);
        });

        // it("saves an item into canvasItems", () => {
        //     const state = {
        //         ...initialState,
        //         tool: tool,
        //         toolArea: area,
        //         itemText: text,
        //     };

        //     const result = squareDotReducer(state, {
        //         type: "item/save",
        //         payload: id,
        //     });

        //     expect(result.canvasItems).toHaveLength(1);
        //     expect(result).toStrictEqual({
        //         ...initialState,
        //         canvasItems: [
        //             {
        //                 area: area,
        //                 id: id,
        //                 style: defaultStyle,
        //                 text: text,
        //                 type: tool,
        //             },
        //         ],
        //         lastSavedItemId: id,
        //         tool: tool,
        //         toolArea: null,
        //         itemText: "",
        //     });
        // });
        // });

        it("saves an items style", () => {
            const result = squareDotReducer(initialState, {
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
            const result = squareDotReducer(initialState, {
                type: "item/text",
                payload: text,
            });

            expect(result).toStrictEqual({
                ...initialState,
                itemText: text,
            });
        });
    });

    // describe("tool/", () => {
    //     it("activates a tool", () => {
    //         const result = squareDotReducer(initialState, {
    //             type: "tool/selected",
    //             payload: tool,
    //         });

    //         expect(result.tool).toBe(tool);
    //     });
    // });
});
