import { describe, expect, it } from "vitest";

import type { Rect, TextElement } from "../model/DotDocument";
import type { DotState, EditSession } from "../model/DotDocumentState";

import { initialState, initialStyle } from "./DotInitialState";
import { dotReducer } from "./DotReducer";

const area: Rect = {
    left: 15,
    top: 30,
    width: 90,
    height: 45,
};

const savedElement: TextElement = {
    id: "element-1",
    toolType: "text",
    area,
    style: { ...initialStyle },
    text: "Original text",
};

function stateWithSavedElement(): DotState {
    return {
        ...initialState,
        document: {
            ...initialState.document,
            elements: [savedElement],
        },
    };
}

function getSession(state: DotState): EditSession {
    if (state.canvasMode.mode === "idle") {
        throw new Error("Expected an active edit session");
    }

    return state.canvasMode.session;
}

describe("dotReducer", () => {
    describe("action/*", () => {
        describe("action/back", () => {
            it("goes back to idle from drawing", () => {
                const drawing = dotReducer(initialState, {
                    type: "canvasMode/switch",
                    payload: {
                        toolType: null,
                        area: area,
                    },
                });

                const back = dotReducer(drawing, {
                    type: "action/back",
                });

                expect(back.canvasMode.mode).toBe("idle");
            });

            it("goes back to drawing from editing", () => {
                const editing = dotReducer(initialState, {
                    type: "canvasMode/switch",
                    payload: {
                        toolType: "text",
                        area: area,
                    },
                });

                const back = dotReducer(editing, {
                    type: "action/back",
                });

                expect(back.canvasMode.mode).toBe("drawing");
            });

            it("goes back to idle without changing an element when editing a saved element", () => {
                const editing = dotReducer(stateWithSavedElement(), {
                    type: "element/edit",
                    payload: savedElement.id,
                });
                const draftChanges = dotReducer(editing, {
                    type: "change/draft/text",
                    payload: "New draft changes to be reverted",
                });
                const backToDrawing = dotReducer(draftChanges, {
                    type: "action/back",
                });
                expect(backToDrawing.canvasMode.mode).toBe("drawing");
                expect(backToDrawing.document.elements.length).toBe(1);

                const backToIdle = dotReducer(backToDrawing, {
                    type: "action/back",
                });
                expect(backToIdle.canvasMode.mode).toBe("idle");
                expect(backToIdle.document.elements).toMatchObject([
                    savedElement,
                ]);
            });
        });

        describe("action/cancel", () => {
            it("cancels drawing and returns to idle", () => {
                const drawing = dotReducer(initialState, {
                    type: "canvasMode/switch",
                    payload: {
                        toolType: null,
                        area: area,
                    },
                });

                const cancel = dotReducer(drawing, {
                    type: "action/cancel",
                });

                expect(cancel.canvasMode.mode).toBe("idle");
            });

            it("cancels editing and returns to idle", () => {
                const editing = dotReducer(initialState, {
                    type: "canvasMode/switch",
                    payload: {
                        toolType: "text",
                        area: area,
                    },
                });

                const cancel = dotReducer(editing, {
                    type: "action/cancel",
                });

                expect(cancel.canvasMode.mode).toBe("idle");
            });

            it("cancels editing element and returns to idle with no changes to saved element", () => {
                const state = stateWithSavedElement();
                const editing = dotReducer(state, {
                    type: "element/edit",
                    payload: savedElement.id,
                });
                const draftChanges = dotReducer(editing, {
                    type: "change/draft/text",
                    payload: "New draft changes to be reverted",
                });
                const cancel = dotReducer(draftChanges, {
                    type: "action/cancel",
                });

                expect(cancel.canvasMode.mode).toBe("idle");
                expect(cancel.document).toEqual(state.document);
            });

            it("discards a new draft", () => {
                const drawing = dotReducer(initialState, {
                    type: "canvasMode/switch",
                    payload: { toolType: null, area },
                });
                const editing = dotReducer(drawing, {
                    type: "canvasMode/switch",
                    payload: { toolType: "text", area },
                });
                const cancelled = dotReducer(editing, {
                    type: "action/cancel",
                });

                expect(cancelled.canvasMode).toEqual({ mode: "idle" });
                expect(cancelled.document.elements).toEqual([]);
            });
        });

        describe("action/save", () => {
            it("saves a draft element", () => {
                const editing = dotReducer(initialState, {
                    type: "canvasMode/switch",
                    payload: {
                        toolType: "text",
                        area: area,
                    },
                });

                expect(editing.document.elements.length).toBe(0);

                const save = dotReducer(editing, {
                    type: "action/save",
                    payload: {
                        id: savedElement.id,
                        element: savedElement,
                    },
                });

                expect(save.canvasMode.mode).toBe("idle");
                expect(save.document.elements.length).toBe(1);
                expect(save.document.elements).toMatchObject([savedElement]);
            });

            it("replaces an edited element without changing its ID", () => {
                const editing = dotReducer(stateWithSavedElement(), {
                    type: "element/edit",
                    payload: savedElement.id,
                });
                const changed = dotReducer(editing, {
                    type: "change/draft/text",
                    payload: "Saved text",
                });
                const session = getSession(changed);
                const saved = dotReducer(changed, {
                    type: "action/save",
                    payload: {
                        id: session.editId ?? "unexpected-new-id",
                        element: session.element,
                    },
                });

                expect(saved.document.elements).toHaveLength(1);
                expect(saved.document.elements[0]).toMatchObject({
                    id: savedElement.id,
                    text: "Saved text",
                });
            });

            it("appends a newly saved element", () => {
                const editing = dotReducer(initialState, {
                    type: "canvasMode/switch",
                    payload: { toolType: "text", area },
                });
                const session = getSession(editing);
                const saved = dotReducer(editing, {
                    type: "action/save",
                    payload: {
                        id: "new-element",
                        element: {
                            ...session.element,
                            text: "New text",
                        },
                    },
                });

                expect(saved.document.elements).toEqual([
                    expect.objectContaining({
                        id: "new-element",
                        text: "New text",
                    }),
                ]);
            });
        });
    });

    describe("canvasMode/*", () => {
        describe("canvasMode/switch", () => {
            it("retains the complete session when moving back to drawing and editing", () => {
                const editing = dotReducer(stateWithSavedElement(), {
                    type: "element/edit",
                    payload: savedElement.id,
                });
                const withText = dotReducer(editing, {
                    type: "change/draft/text",
                    payload: "Draft text",
                });
                const drawing = dotReducer(withText, { type: "action/back" });
                const resumed = dotReducer(drawing, {
                    type: "canvasMode/switch",
                    payload: {
                        toolType: "text",
                        area: getSession(drawing).element.area,
                    },
                });

                expect(resumed.canvasMode.mode).toBe("editing");
                expect(getSession(resumed)).toMatchObject({
                    editId: savedElement.id,
                    element: {
                        area,
                        style: initialStyle,
                        text: "Draft text",
                    },
                });
            });
        });
    });

    describe("element/*", () => {
        describe("element/edit", () => {
            it("keeps the saved element in the document while editing", () => {
                const state = stateWithSavedElement();
                const editing = dotReducer(state, {
                    type: "element/edit",
                    payload: savedElement.id,
                });

                expect(editing.document.elements).toEqual([savedElement]);
                expect(getSession(editing).editId).toBe(savedElement.id);
            });
        });
    });

    describe("change/*", () => {
        describe("change/draft/area", () => {
            it("resizes without clearing the existing element ID", () => {
                const editing = dotReducer(stateWithSavedElement(), {
                    type: "element/edit",
                    payload: savedElement.id,
                });
                const resizedArea = { ...area, width: 120 };
                const resized = dotReducer(editing, {
                    type: "change/draft/area",
                    payload: resizedArea,
                });

                expect(getSession(resized).editId).toBe(savedElement.id);
                expect(getSession(resized).element.area).toEqual(resizedArea);
            });
        });
    });
});
