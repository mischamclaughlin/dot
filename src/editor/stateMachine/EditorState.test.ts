import { describe, expect, it } from "vitest";
import { textElement } from "../../application/commands/element/test/testFactory";
import { createTextElement } from "../../application/commands/element/textElement/create";
import { createEmptyDocument } from "../../domain/document/DotDocument";
import {
    cloneTextElement,
    type TextElement,
} from "../../domain/elements/TextElement";
import { createEditorState, reduceEditorState } from "./EditorState";

describe("reduceEditorState", () => {
    const idleState = createEditorState({
        past: [],
        present: createEmptyDocument(),
        future: [],
    });

    const element: TextElement = textElement();

    it("has status `idle`", () => {
        expect(idleState.mode).toEqual({ status: "idle" });
    });

    it("returns the diel state when updating while idle", () => {
        const document = createEmptyDocument();

        const created = createTextElement(document, element);

        if (!created.ok) {
            throw new Error(`createTextElement error: ${created.error}`);
        }

        const initialState = createEditorState({
            past: [],
            present: created.document,
            future: [],
        });

        const updatedStyle = reduceEditorState(initialState, {
            type: "draftStyleChanged",
            style: {
                ...element.style,
                fontSize: 12,
            },
        });

        expect(updatedStyle.mode).toEqual({
            status: "idle",
        });
    });

    describe("event type is createStarted", () => {
        it("starts a new detached text draft while idle", () => {
            const document = createEmptyDocument();

            const initialState = createEditorState({
                past: [],
                present: document,
                future: [],
            });

            const creatingState = reduceEditorState(initialState, {
                type: "createStarted",
                element: element,
            });

            expect(creatingState.mode).toEqual({
                status: "creating-text",
                draft: element,
            });

            if (creatingState.mode.status !== "creating-text") {
                throw new Error("Expected creating-text mode");
            }

            expect(creatingState.mode.draft).not.toBe(element);
            expect(creatingState.mode.draft.rect).not.toBe(element.rect);
            expect(creatingState.mode.draft.style).not.toBe(element.style);

            expect(creatingState.history).toBe(initialState.history);
            expect(creatingState.history.present.rootIds).toEqual([]);
            expect(creatingState.history.present.elements).toEqual({});
        });

        it("returns the same state if not in idle", () => {
            const document = createEmptyDocument();

            const initialState = createEditorState({
                past: [],
                present: document,
                future: [],
            });

            const creatingState = reduceEditorState(initialState, {
                type: "createStarted",
                element: element,
            });

            expect(creatingState.mode).toEqual({
                status: "creating-text",
                draft: element,
            });

            if (creatingState.mode.status !== "creating-text") {
                throw new Error("Expected creating-text mode");
            }

            const reCreatingState = reduceEditorState(creatingState, {
                type: "createStarted",
                element: element,
            });

            if (reCreatingState.mode.status !== "creating-text") {
                throw new Error("Expected creating-text mode");
            }

            expect(reCreatingState.mode.draft).not.toBe(element);
            expect(reCreatingState.mode.draft.rect).not.toBe(element.rect);
            expect(reCreatingState.mode.draft.style).not.toBe(element.style);

            expect(reCreatingState.history).toBe(initialState.history);
            expect(reCreatingState.history.present.rootIds).toEqual([]);
            expect(reCreatingState.history.present.elements).toEqual({});
        });
    });

    describe("event type is editStarted", () => {
        it("starts a detached text edit draft while in idle", () => {
            const document = createEmptyDocument();

            const created = createTextElement(document, element);
            if (!created.ok) {
                throw new Error(`createTextElement error: ${created.error}`);
            }

            const initialState = createEditorState({
                past: [],
                present: created.document,
                future: [],
            });

            const editingState = reduceEditorState(initialState, {
                type: "editStarted",
                originalId: element.id,
            });

            expect(editingState.mode).toEqual({
                status: "editing-text",
                originalId: element.id,
                draft: cloneTextElement(element),
            });

            if (editingState.mode.status !== "editing-text") {
                throw new Error("Expected editing-text mode");
            }

            expect(editingState.mode.draft).not.toBe(
                created.document.elements[element.id],
            );
            expect(editingState.mode.draft.rect).not.toBe(element.rect);
            expect(editingState.mode.draft.style).not.toBe(element.style);
        });

        it("returns the same state if not in idle", () => {
            const document = createEmptyDocument();

            const created = createTextElement(document, element);
            if (!created.ok) {
                throw new Error(`createTextElement error: ${created.error}`);
            }

            const initialState = createEditorState({
                past: [],
                present: created.document,
                future: [],
            });

            const editingState = reduceEditorState(initialState, {
                type: "editStarted",
                originalId: element.id,
            });

            expect(editingState.mode).toEqual({
                status: "editing-text",
                originalId: element.id,
                draft: cloneTextElement(element),
            });

            if (editingState.mode.status !== "editing-text") {
                throw new Error("Expected editing-text mode");
            }

            const reCreatingState = reduceEditorState(editingState, {
                type: "editStarted",
                originalId: element.id,
            });

            if (reCreatingState.mode.status !== "editing-text") {
                throw new Error("Expected creating-text mode");
            }

            expect(reCreatingState.mode.draft).not.toBe(
                created.document.elements[element.id],
            );
            expect(reCreatingState.mode.draft.rect).not.toBe(element.rect);
            expect(reCreatingState.mode.draft.style).not.toBe(element.style);
        });

        it("starts a detached text edit draft while in idle", () => {
            const document = createEmptyDocument();

            const created = createTextElement(document, element);
            if (!created.ok) {
                throw new Error(`createTextElement error: ${created.error}`);
            }

            const initialState = createEditorState({
                past: [],
                present: created.document,
                future: [],
            });

            const editingState = reduceEditorState(initialState, {
                type: "editStarted",
                originalId: "invalid-id",
            });

            expect(editingState.lastError).toEqual("invalid-id");
        });
    });

    describe("event type is draftTextChanged", () => {
        it("updates the text on a TextElement", () => {
            const document = createEmptyDocument();

            const created = createTextElement(document, element);
            if (!created.ok) {
                throw new Error(`createTextElement error: ${created.error}`);
            }

            const initialState = createEditorState({
                past: [],
                present: created.document,
                future: [],
            });

            const editingState = reduceEditorState(initialState, {
                type: "editStarted",
                originalId: element.id,
            });

            expect(editingState.mode).toEqual({
                status: "editing-text",
                originalId: element.id,
                draft: cloneTextElement(element),
            });

            if (editingState.mode.status !== "editing-text") {
                throw new Error("Expected editing-text mode");
            }

            const updatedText = reduceEditorState(editingState, {
                type: "draftTextChanged",
                text: "updated text",
            });

            expect(updatedText.mode).toEqual({
                status: "editing-text",
                originalId: "text-1",
                draft: {
                    ...element,
                    text: "updated text",
                },
            });
        });
    });

    describe("event type is draftStyleChanged", () => {
        it("updates the style on a TextElement", () => {
            const document = createEmptyDocument();

            const created = createTextElement(document, element);
            if (!created.ok) {
                throw new Error(`createTextElement error: ${created.error}`);
            }

            const initialState = createEditorState({
                past: [],
                present: created.document,
                future: [],
            });

            const editingState = reduceEditorState(initialState, {
                type: "editStarted",
                originalId: element.id,
            });

            expect(editingState.mode).toEqual({
                status: "editing-text",
                originalId: element.id,
                draft: cloneTextElement(element),
            });

            if (editingState.mode.status !== "editing-text") {
                throw new Error("Expected editing-text mode");
            }

            const updatedStyle = reduceEditorState(editingState, {
                type: "draftStyleChanged",
                style: {
                    ...element.style,
                    fontSize: 12,
                },
            });

            expect(updatedStyle.mode).toEqual({
                status: "editing-text",
                originalId: "text-1",
                draft: {
                    ...element,
                    style: {
                        ...element.style,
                        fontSize: 12,
                    },
                },
            });
        });
    });

    describe("event type is draftRectChanged", () => {
        it("updates the rect on a TextElement", () => {
            const document = createEmptyDocument();

            const created = createTextElement(document, element);
            if (!created.ok) {
                throw new Error(`createTextElement error: ${created.error}`);
            }

            const initialState = createEditorState({
                past: [],
                present: created.document,
                future: [],
            });

            const editingState = reduceEditorState(initialState, {
                type: "editStarted",
                originalId: element.id,
            });

            expect(editingState.mode).toEqual({
                status: "editing-text",
                originalId: element.id,
                draft: cloneTextElement(element),
            });

            if (editingState.mode.status !== "editing-text") {
                throw new Error("Expected editing-text mode");
            }

            const updatedRect = reduceEditorState(editingState, {
                type: "draftRectChanged",
                rect: {
                    ...element.rect,
                    x: 1000,
                },
            });

            expect(updatedRect.mode).toEqual({
                status: "editing-text",
                originalId: "text-1",
                draft: {
                    ...element,
                    rect: {
                        ...element.rect,
                        x: 1000,
                    },
                },
            });
        });
    });

    describe("event type is draftSaved", () => {
        it("saves an updated TextElement", () => {
            const initialDocument = {
                ...createEmptyDocument(),
                rootIds: [element.id],
                elements: {
                    [element.id]: element,
                },
            };

            const initialState = createEditorState({
                past: [],
                present: initialDocument,
                future: [],
            });

            const editingState = reduceEditorState(initialState, {
                type: "editStarted",
                originalId: element.id,
            });

            const updatedElement = {
                ...element,
                rect: { ...element.rect, x: 1000 },
            };

            const updatedState = reduceEditorState(editingState, {
                type: "draftRectChanged",
                rect: updatedElement.rect,
            });

            expect(updatedState.history).toBe(initialState.history);

            const savedState = reduceEditorState(updatedState, {
                type: "draftSaved",
            });

            expect(savedState.mode).toEqual({ status: "idle" });
            expect(savedState.lastError).toBeUndefined();
            expect(savedState.history).toEqual({
                past: [initialDocument],
                present: {
                    ...initialDocument,
                    elements: {
                        [element.id]: updatedElement,
                    },
                },
                future: [],
            });

            expect(initialDocument.elements[element.id].rect.x).toBe(0);
        });

        it("returns the idle state when saving while idle", () => {
            const document = createEmptyDocument();

            const created = createTextElement(document, element);

            if (!created.ok) {
                throw new Error(`createTextElement error: ${created.error}`);
            }

            const initialState = createEditorState({
                past: [],
                present: created.document,
                future: [],
            });

            const savedStyle = reduceEditorState(initialState, {
                type: "draftSaved",
            });

            expect(savedStyle.mode).toEqual({
                status: "idle",
            });
        });

        it("retains the draft and exposes the error when saving fails", () => {
            const element = textElement();
            const created = createTextElement(createEmptyDocument(), element);

            if (!created.ok) {
                throw new Error(`createTextElement error: ${created.error}`);
            }

            const initialState = createEditorState({
                past: [],
                present: created.document,
                future: [],
            });

            const creatingState = reduceEditorState(initialState, {
                type: "createStarted",
                element,
            });

            expect(creatingState.mode.status).toBe("creating-text");
            expect(creatingState.history).toBe(initialState.history);

            const failedState = reduceEditorState(creatingState, {
                type: "draftSaved",
            });

            expect(failedState.lastError).toBe("duplicate-id");

            expect(failedState.mode).toEqual({
                status: "creating-text",
                draft: element,
            });

            expect(failedState.history).toBe(initialState.history);
            expect(failedState.history.past).toEqual([]);
            expect(failedState.history.present).toBe(created.document);
            expect(failedState.history.future).toEqual([]);
        });
    });

    describe("event type is draftCanceled", () => {
        it("saves an updated TextElement", () => {
            const initialDocument = {
                ...createEmptyDocument(),
                rootIds: [element.id],
                elements: {
                    [element.id]: element,
                },
            };

            const initialState = createEditorState({
                past: [],
                present: initialDocument,
                future: [],
            });

            const editingState = reduceEditorState(initialState, {
                type: "editStarted",
                originalId: element.id,
            });

            const cancelState = reduceEditorState(editingState, {
                type: "draftCancelled",
            });

            expect(cancelState.mode).toEqual({ status: "idle" });
            expect(cancelState.lastError).toBeUndefined();
            expect(cancelState.history).toEqual({
                past: [],
                present: initialDocument,
                future: [],
            });
        });

        it("returns idle state when cancel while in idle state", () => {
            const initialDocument = {
                ...createEmptyDocument(),
                rootIds: [element.id],
                elements: {
                    [element.id]: element,
                },
            };

            const initialState = createEditorState({
                past: [],
                present: initialDocument,
                future: [],
            });

            const cancelState = reduceEditorState(initialState, {
                type: "draftCancelled",
            });

            expect(cancelState.mode).toEqual({ status: "idle" });
            expect(cancelState.lastError).toBeUndefined();
            expect(cancelState.history).toEqual({
                past: [],
                present: initialDocument,
                future: [],
            });
        });
    });

    describe("event type is undo", () => {
        it("undoes the latest save", () => {
            const initialDocument = {
                ...createEmptyDocument(),
                rootIds: [element.id],
                elements: {
                    [element.id]: element,
                },
            };

            const initialState = createEditorState({
                past: [],
                present: initialDocument,
                future: [],
            });

            const editingState = reduceEditorState(initialState, {
                type: "editStarted",
                originalId: element.id,
            });

            const updatedElement = {
                ...element,
                rect: { ...element.rect, x: 1000 },
            };

            const updatedState = reduceEditorState(editingState, {
                type: "draftRectChanged",
                rect: updatedElement.rect,
            });

            expect(updatedState.history).toBe(initialState.history);

            const savedState = reduceEditorState(updatedState, {
                type: "draftSaved",
            });

            const undoState = reduceEditorState(savedState, {
                type: "undo",
            });

            expect(undoState.mode).toEqual({ status: "idle" });
            expect(undoState.lastError).toBeUndefined();
            expect(undoState.history).toEqual({
                past: [],
                present: initialDocument,
                future: [savedState.history.present],
            });
        });

        it("return idle state when undoing while in idle state", () => {
            const initialDocument = {
                ...createEmptyDocument(),
                rootIds: [element.id],
                elements: {
                    [element.id]: element,
                },
            };

            const initialState = createEditorState({
                past: [],
                present: initialDocument,
                future: [],
            });

            const editingState = reduceEditorState(initialState, {
                type: "editStarted",
                originalId: element.id,
            });

            const updatedElement = {
                ...element,
                rect: { ...element.rect, x: 1000 },
            };

            const updatedState = reduceEditorState(editingState, {
                type: "draftRectChanged",
                rect: updatedElement.rect,
            });

            expect(updatedState.history).toBe(initialState.history);

            const undoState = reduceEditorState(updatedState, {
                type: "undo",
            });

            expect(undoState.mode).toEqual({
                status: "editing-text",
                originalId: "text-1",
                draft: updatedElement,
            });
            expect(undoState.lastError).toBeUndefined();
            expect(undoState.history).toEqual({
                past: [],
                present: initialDocument,
                future: [],
            });
        });
    });

    describe("event type is redo", () => {
        it("redoes the last save", () => {
            const initialDocument = {
                ...createEmptyDocument(),
                rootIds: [element.id],
                elements: {
                    [element.id]: element,
                },
            };

            const initialState = createEditorState({
                past: [],
                present: initialDocument,
                future: [],
            });

            const editingState = reduceEditorState(initialState, {
                type: "editStarted",
                originalId: element.id,
            });

            const updatedElement = {
                ...element,
                rect: { ...element.rect, x: 1000 },
            };

            const updatedState = reduceEditorState(editingState, {
                type: "draftRectChanged",
                rect: updatedElement.rect,
            });

            expect(updatedState.history).toBe(initialState.history);

            const savedState = reduceEditorState(updatedState, {
                type: "draftSaved",
            });

            const undoState = reduceEditorState(savedState, {
                type: "undo",
            });

            const redoState = reduceEditorState(undoState, {
                type: "redo",
            });

            expect(redoState.mode).toEqual({ status: "idle" });
            expect(redoState.lastError).toBeUndefined();
            expect(redoState.history).toEqual({
                past: [initialDocument],
                present: savedState.history.present,
                future: [],
            });
        });

        it("return idle state when redoing while in idle state", () => {
            const initialDocument = {
                ...createEmptyDocument(),
                rootIds: [element.id],
                elements: {
                    [element.id]: element,
                },
            };

            const initialState = createEditorState({
                past: [],
                present: initialDocument,
                future: [],
            });

            const editingState = reduceEditorState(initialState, {
                type: "editStarted",
                originalId: element.id,
            });

            const updatedElement = {
                ...element,
                rect: { ...element.rect, x: 1000 },
            };

            const updatedState = reduceEditorState(editingState, {
                type: "draftRectChanged",
                rect: updatedElement.rect,
            });

            expect(updatedState.history).toBe(initialState.history);

            const redoState = reduceEditorState(updatedState, {
                type: "redo",
            });

            expect(redoState.mode).toEqual({
                status: "editing-text",
                originalId: "text-1",
                draft: updatedElement,
            });
            expect(redoState.lastError).toBeUndefined();
            expect(redoState.history).toEqual({
                past: [],
                present: initialDocument,
                future: [],
            });
        });
    });
});
