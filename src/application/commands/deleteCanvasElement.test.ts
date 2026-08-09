import { describe, expect, it } from "vitest";

import { createEmptyDocument } from "../../domain/document/DotDocument";

import { createTextElement } from "./createTextElement";
import { deleteCanvasElement } from "./deleteCanvasElement";
import { textElement } from "./test/testFactory";

describe("deleteCanvasElement", () => {
    it("deletes a CanvasElement without changing the original document", () => {
        const created = createTextElement(createEmptyDocument(), textElement());

        if (!created.ok) {
            throw new Error(`createText failed: ${created.error}`);
        }

        const previousDocument = created.document;
        const deleted = deleteCanvasElement(previousDocument, "text-1");

        if (!deleted.ok) {
            throw new Error(`deletedCanvasElement failed: ${deleted.error}`);
        }

        expect(deleted.document.rootIds).toEqual([]);
        expect(deleted.document.elements).toEqual({});

        expect(previousDocument.rootIds).toEqual(["text-1"]);
        expect(previousDocument.elements["text-1"]).toBeDefined();
    });

    it("deletes only the requested element", () => {
        const first = createTextElement(createEmptyDocument(), textElement());
        if (!first.ok) {
            throw new Error(`createTextElement error: ${first.error}`);
        }

        const second = createTextElement(first.document, textElement("text-2"));
        if (!second.ok) {
            throw new Error(`createTextElement error: ${second.error}`);
        }

        const deleted = deleteCanvasElement(second.document, "text-1");
        if (!deleted.ok) {
            throw new Error(`deletedCanvasElement error: ${deleted.error}`);
        }

        expect(deleted.document.rootIds).toEqual(["text-2"]);
        expect(deleted.document.elements["text-1"]).toBeUndefined();
        expect(deleted.document.elements["text-2"]).toBeDefined();
    });

    it("reject invalid IDs", () => {
        const deleted = deleteCanvasElement(createEmptyDocument(), "text-1");

        expect(deleted).toEqual({
            ok: false,
            error: "invalid-id",
        });
    });

    it("survives a JSON round trip", () => {
        const created = createTextElement(createEmptyDocument(), textElement());

        if (!created.ok) {
            throw new Error(`createText failed: ${created.error}`);
        }

        const result = deleteCanvasElement(created.document, "text-1");

        if (!result.ok) {
            throw new Error(`deleteCanvasElement failed: ${result.error}`);
        }

        const serialisedDocument = JSON.stringify(result.document);
        const parseDocument: unknown = JSON.parse(serialisedDocument);

        expect(parseDocument).toEqual(result.document);
    });
});
