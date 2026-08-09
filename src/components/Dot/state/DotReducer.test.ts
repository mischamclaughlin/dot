import { describe, expect, it } from "vitest";

import {
    createDefaultInheritancePolicy,
    type Rect,
    type TextElement,
} from "../model/DotDocument";
import type { DotState, EditSession } from "../model/DotDocumentState";
import { resolveElement } from "../services/DotInheritanceService";

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
    childInheritance: createDefaultInheritancePolicy(),
};

const secondSavedElement: TextElement = {
    ...savedElement,
    id: "element-2",
    area: {
        ...area,
        left: area.left + area.width + 15,
        width: 60,
        height: 30,
    },
    style: {
        ...initialStyle,
        colourBackground: "#ffffff",
        fontSize: 2,
    },
    text: "Second element",
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

function stateWithRelationship(): DotState {
    return {
        ...initialState,
        document: {
            ...initialState.document,
            elements: [savedElement, secondSavedElement],
            relationships: [
                {
                    type: "parent",
                    parentId: savedElement.id,
                    childId: secondSavedElement.id,
                },
            ],
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

        describe("element/select", () => {
            it("tracks selection outside the saved document", () => {
                const state = stateWithSavedElement();
                const selected = dotReducer(state, {
                    type: "element/select",
                    payload: savedElement.id,
                });

                expect(selected.document).toBe(state.document);
                expect(selected.selectedElementIds).toEqual(
                    new Set([savedElement.id]),
                );
                expect(selected.document.elements[0]).not.toHaveProperty(
                    "selected",
                );
            });

            it("toggles selection without mutating the previous state", () => {
                const selected = dotReducer(stateWithSavedElement(), {
                    type: "element/select",
                    payload: savedElement.id,
                });
                const deselected = dotReducer(selected, {
                    type: "element/select",
                    payload: savedElement.id,
                });

                expect(selected.selectedElementIds).toEqual(
                    new Set([savedElement.id]),
                );
                expect(deselected.selectedElementIds).toEqual(new Set());
            });
        });

        describe("element/deselect", () => {
            it("clears selection without changing the saved document", () => {
                const state = stateWithSavedElement();
                const selected = {
                    ...state,
                    selectedElementIds: new Set([savedElement.id]),
                };
                const deselected = dotReducer(selected, {
                    type: "element/deselect",
                });

                expect(deselected.document).toBe(state.document);
                expect(deselected.selectedElementIds).toEqual(new Set());
                expect(selected.selectedElementIds).toEqual(
                    new Set([savedElement.id]),
                );
            });
        });

        describe("element/delete", () => {
            it("removes a deleted element from selection", () => {
                const state = {
                    ...stateWithSavedElement(),
                    selectedElementIds: new Set([savedElement.id]),
                };
                const deleted = dotReducer(state, {
                    type: "element/delete",
                    payload: savedElement.id,
                });

                expect(deleted.document.elements).toEqual([]);
                expect(deleted.selectedElementIds).toEqual(new Set());
            });

            it("cancels the active edit when its saved element is deleted", () => {
                const selected = {
                    ...stateWithSavedElement(),
                    selectedElementIds: new Set([savedElement.id]),
                };
                const editing = dotReducer(selected, {
                    type: "element/edit",
                    payload: savedElement.id,
                });
                const deleted = dotReducer(editing, {
                    type: "element/delete",
                    payload: savedElement.id,
                });

                expect(deleted.document.elements).toEqual([]);
                expect(deleted.selectedElementIds).toEqual(new Set());
                expect(deleted.toolType).toBeNull();
                expect(deleted.canvasMode).toEqual({ mode: "idle" });
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

        describe("change/element/area", () => {
            function stateWithSelectedElements(): DotState {
                return {
                    ...initialState,
                    document: {
                        ...initialState.document,
                        elements: [savedElement, secondSavedElement],
                    },
                    selectedElementIds: new Set([
                        savedElement.id,
                        secondSavedElement.id,
                    ]),
                };
            }

            it("moves the complete selection with a selected element", () => {
                const state = stateWithSelectedElements();
                const movedArea = {
                    ...savedElement.area,
                    left: savedElement.area.left + 30,
                    top: savedElement.area.top + 15,
                };
                const moved = dotReducer(state, {
                    type: "change/element/area",
                    payload: { id: savedElement.id, area: movedArea },
                });

                expect(moved.document.elements[0].area).toEqual(movedArea);
                expect(moved.document.elements[1].area).toEqual({
                    ...secondSavedElement.area,
                    left: secondSavedElement.area.left + 30,
                    top: secondSavedElement.area.top + 15,
                });
            });

            it("resizes only the changed element", () => {
                const state = stateWithSelectedElements();
                const resizedArea = {
                    ...savedElement.area,
                    width: savedElement.area.width + 15,
                };
                const resized = dotReducer(state, {
                    type: "change/element/area",
                    payload: { id: savedElement.id, area: resizedArea },
                });

                expect(resized.document.elements[0].area).toEqual(resizedArea);
                expect(resized.document.elements[1]).toBe(secondSavedElement);
            });
        });
    });

    describe("relationship/*", () => {
        it("sets one parent per child and rejects cycles", () => {
            const state = {
                ...initialState,
                document: {
                    ...initialState.document,
                    elements: [savedElement, secondSavedElement],
                },
            };
            const linked = dotReducer(state, {
                type: "relationship/parent/set",
                payload: {
                    parentId: savedElement.id,
                    childId: secondSavedElement.id,
                },
            });
            const cycleAttempt = dotReducer(linked, {
                type: "relationship/parent/set",
                payload: {
                    parentId: secondSavedElement.id,
                    childId: savedElement.id,
                },
            });

            expect(linked.document.relationships).toEqual([
                {
                    type: "parent",
                    parentId: savedElement.id,
                    childId: secondSavedElement.id,
                },
            ]);
            expect(cycleAttempt).toBe(linked);
        });

        it("resolves only inherited presentation attributes", () => {
            const state = stateWithRelationship();
            const child = resolveElement(
                state.document,
                secondSavedElement.id,
            );

            expect(child).toMatchObject({
                area: {
                    left: secondSavedElement.area.left,
                    top: secondSavedElement.area.top,
                    width: savedElement.area.width,
                    height: savedElement.area.height,
                },
                style: savedElement.style,
                text: secondSavedElement.text,
            });
        });

        it("materialises inherited values when unlinking", () => {
            const state = stateWithRelationship();
            const unlinked = dotReducer(state, {
                type: "relationship/parent/unset",
                payload: secondSavedElement.id,
            });

            expect(unlinked.document.relationships).toEqual([]);
            expect(unlinked.document.elements[1]).toMatchObject({
                area: {
                    left: secondSavedElement.area.left,
                    top: secondSavedElement.area.top,
                    width: savedElement.area.width,
                    height: savedElement.area.height,
                },
                style: savedElement.style,
            });
        });

        it("materialises children and removes relationships when deleting a parent", () => {
            const deleted = dotReducer(stateWithRelationship(), {
                type: "element/delete",
                payload: savedElement.id,
            });

            expect(deleted.document.relationships).toEqual([]);
            expect(deleted.document.elements).toHaveLength(1);
            expect(deleted.document.elements[0]).toMatchObject({
                id: secondSavedElement.id,
                area: {
                    left: secondSavedElement.area.left,
                    top: secondSavedElement.area.top,
                    width: savedElement.area.width,
                    height: savedElement.area.height,
                },
                style: savedElement.style,
            });
        });

        it("preserves hidden local values when editing an inherited child", () => {
            const state = stateWithRelationship();
            const editing = dotReducer(state, {
                type: "element/edit",
                payload: secondSavedElement.id,
            });
            const session = getSession(editing);
            const saved = dotReducer(editing, {
                type: "action/save",
                payload: {
                    id: secondSavedElement.id,
                    element: {
                        ...session.element,
                        text: "Edited child",
                    },
                },
            });

            expect(session.element.area).toEqual({
                ...secondSavedElement.area,
                width: savedElement.area.width,
                height: savedElement.area.height,
            });
            expect(saved.document.elements[1]).toMatchObject({
                area: secondSavedElement.area,
                style: secondSavedElement.style,
                text: "Edited child",
            });
        });

        it("copies the resolved appearance without copying the relationship", () => {
            const copied = dotReducer(stateWithRelationship(), {
                type: "element/copy",
                payload: {
                    id: secondSavedElement.id,
                    newId: "copied-child",
                },
            });
            const elementCopy = copied.document.elements[2];

            expect(elementCopy).toMatchObject({
                id: "copied-child",
                area: {
                    left: secondSavedElement.area.left,
                    width: savedElement.area.width,
                    height: savedElement.area.height,
                },
                style: savedElement.style,
            });
            expect(
                copied.document.relationships.some(
                    (relationship) =>
                        relationship.childId === "copied-child",
                ),
            ).toBe(false);
        });
    });

    describe("inheritance/*", () => {
        it("materialises an attribute before disabling its inheritance", () => {
            const withoutInheritedWidth = dotReducer(stateWithRelationship(), {
                type: "inheritance/attribute/set",
                payload: {
                    parentId: savedElement.id,
                    group: "geometry",
                    attribute: "width",
                    enabled: false,
                },
            });
            const resizedParent = dotReducer(withoutInheritedWidth, {
                type: "change/element/area",
                payload: {
                    id: savedElement.id,
                    area: { ...savedElement.area, width: 150 },
                },
            });
            const child = resolveElement(
                resizedParent.document,
                secondSavedElement.id,
            );

            expect(
                resizedParent.document.elements[0].childInheritance.geometry,
            ).toEqual(["height"]);
            expect(resizedParent.document.elements[1].area.width).toBe(
                savedElement.area.width,
            );
            expect(child?.area.width).toBe(savedElement.area.width);
        });

        it("inherits effective values through nested parents", () => {
            const grandchild: TextElement = {
                ...secondSavedElement,
                id: "element-3",
                text: "Grandchild",
            };
            const state: DotState = {
                ...stateWithRelationship(),
                document: {
                    ...stateWithRelationship().document,
                    elements: [
                        savedElement,
                        secondSavedElement,
                        grandchild,
                    ],
                    relationships: [
                        ...stateWithRelationship().document.relationships,
                        {
                            type: "parent",
                            parentId: secondSavedElement.id,
                            childId: grandchild.id,
                        },
                    ],
                },
            };

            expect(
                resolveElement(state.document, grandchild.id)?.style,
            ).toEqual(savedElement.style);
        });
    });
});
