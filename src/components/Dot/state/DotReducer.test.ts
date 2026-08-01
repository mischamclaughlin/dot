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

describe("dotReducer editing workflow", () => {
    it("keeps the saved element in the document while editing", () => {
        const state = stateWithSavedElement();
        const editing = dotReducer(state, {
            type: "canvasMode/editElement",
            payload: savedElement.id,
        });

        expect(editing.document.elements).toEqual([savedElement]);
        expect(getSession(editing).editId).toBe(savedElement.id);
    });

    it("retains the complete session when moving back to drawing and editing", () => {
        const editing = dotReducer(stateWithSavedElement(), {
            type: "canvasMode/editElement",
            payload: savedElement.id,
        });
        const withText = dotReducer(editing, {
            type: "draft/textChanged",
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

    it("resizes without clearing the existing element ID", () => {
        const editing = dotReducer(stateWithSavedElement(), {
            type: "canvasMode/editElement",
            payload: savedElement.id,
        });
        const resizedArea = { ...area, width: 120 };
        const resized = dotReducer(editing, {
            type: "resize/area",
            payload: resizedArea,
        });

        expect(getSession(resized).editId).toBe(savedElement.id);
        expect(getSession(resized).element.area).toEqual(resizedArea);
    });

    it("discards an edited draft without changing the saved document", () => {
        const state = stateWithSavedElement();
        const editing = dotReducer(state, {
            type: "canvasMode/editElement",
            payload: savedElement.id,
        });
        const changed = dotReducer(editing, {
            type: "draft/textChanged",
            payload: "Changed text",
        });
        const cancelled = dotReducer(changed, { type: "action/cancel" });

        expect(cancelled.canvasMode).toEqual({ mode: "idle" });
        expect(cancelled.document).toEqual(state.document);
    });

    it("replaces an edited element without changing its ID", () => {
        const editing = dotReducer(stateWithSavedElement(), {
            type: "canvasMode/editElement",
            payload: savedElement.id,
        });
        const changed = dotReducer(editing, {
            type: "draft/textChanged",
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

    it("discards a new draft on cancel", () => {
        const drawing = dotReducer(initialState, {
            type: "canvasMode/switch",
            payload: { toolType: null, area },
        });
        const editing = dotReducer(drawing, {
            type: "canvasMode/switch",
            payload: { toolType: "text", area },
        });
        const cancelled = dotReducer(editing, { type: "action/cancel" });

        expect(cancelled.canvasMode).toEqual({ mode: "idle" });
        expect(cancelled.document.elements).toEqual([]);
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
