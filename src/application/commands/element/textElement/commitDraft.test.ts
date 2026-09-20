import { describe, expect, it } from "vitest";
import { createEmptyDocument } from "../../../../domain/document/DotDocument";
import type { TextElement } from "../../../../domain/elements/TextElement";
import { textElement } from "../../../../test/fixtures/textElement";
import {
    commitTextElementDraft,
    type CommitTextElementDraft,
} from "./commitDraft";
import { createTextElement } from "./create";

describe("commitTextElementDraft", () => {
    it("creates a new textElement if mode is create", () => {
        const initialDoc = createEmptyDocument();

        const element = textElement();

        const draftStateCreate = {
            mode: "create",
            element: element,
        } satisfies CommitTextElementDraft;

        const committedElement = commitTextElementDraft(
            initialDoc,
            draftStateCreate,
        );

        if (!committedElement.ok) {
            throw new Error(
                `commitTextElementDraft error: ${committedElement.error}`,
            );
        }

        expect(committedElement.document.rootIds).toEqual(["text-1"]);
        expect(committedElement.document.elements["text-1"]).toEqual(element);

        expect(initialDoc.rootIds).toEqual([]);
        expect(initialDoc.elements).toEqual({});
    });

    it("replaces a textElement if mode is edit", () => {
        const initialDoc = createEmptyDocument();

        const element = textElement();

        const created = createTextElement(initialDoc, element);
        if (!created.ok) {
            throw new Error(`createTextElement error: ${created.error}`);
        }

        const editedElement = {
            ...element,
            text: "Edited text",
            rect: {
                ...element.rect,
                x: 30,
            },
        };

        const draftStateCreate = {
            mode: "edit",
            originalId: element.id,
            element: editedElement,
        } satisfies CommitTextElementDraft;

        const committedElement = commitTextElementDraft(
            created.document,
            draftStateCreate,
        );
        if (!committedElement.ok) {
            throw new Error(
                `commitTextElementDraft error: ${committedElement.error}`,
            );
        }

        expect(committedElement.document.elements[element.id]).toEqual(
            editedElement,
        );
        expect(created.document.elements[element.id]).toEqual(element);
        expect(committedElement.document).not.toBe(created.document);
    });

    it("rejects if bad ID", () => {
        const initialDoc = createEmptyDocument();

        const element = textElement();

        const created = createTextElement(initialDoc, element);
        if (!created.ok) {
            throw new Error(`createTextElement error: ${created.error}`);
        }

        const draftStateCreate = {
            mode: "edit",
            originalId: "bad-id",
            element: element,
        } satisfies CommitTextElementDraft;

        const committedElement = commitTextElementDraft(
            created.document,
            draftStateCreate,
        );

        expect(committedElement.ok).toEqual(false);
        expect(committedElement).toEqual({
            ok: false,
            error: "id-mismatch",
        });
    });

    it("rejects editing an element that does not exist", () => {
        const document = createEmptyDocument();
        const element = textElement("missing-id");

        const result = commitTextElementDraft(document, {
            mode: "edit",
            originalId: "missing-id",
            element,
        });

        expect(result).toEqual({
            ok: false,
            error: "invalid-id",
        });
    });

    it("returns the existing document when an edit is unchanged", () => {
        const element = textElement();
        const created = createTextElement(createEmptyDocument(), element);

        if (!created.ok) {
            throw new Error(`createTextElement error: ${created.error}`);
        }

        const result = commitTextElementDraft(created.document, {
            mode: "edit",
            originalId: element.id,
            element,
        });

        if (!result.ok) {
            throw new Error(`commitTextElementDraft error: ${result.error}`);
        }

        expect(result.document).toBe(created.document);
    });

    it("rejects an invalid element when editing", () => {
        const element = textElement();
        const created = createTextElement(createEmptyDocument(), element);

        if (!created.ok) {
            throw new Error(`createTextElement error: ${created.error}`);
        }

        const invalidElement = {
            ...element,
            kind: "bad-kind",
        } as unknown as TextElement;

        const result = commitTextElementDraft(created.document, {
            mode: "edit",
            originalId: element.id,
            element: invalidElement,
        });

        expect(result).toEqual({
            ok: false,
            error: "invalid-element",
        });

        expect(created.document.elements[element.id]).toEqual(element);
    });
});
