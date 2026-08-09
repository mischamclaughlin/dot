import { describe, expect, it } from "vitest";

import { createEmptyDocument } from "../../../../domain/document/DotDocument";

import { textElement } from "../test/testFactory";

import { createTextElement } from "./create";

describe("createTextElement", () => {
    it("adds a TextElement without changing the original document", () => {
        const previousDocument = createEmptyDocument();
        const element = textElement();

        const result = createTextElement(previousDocument, element);

        if (!result.ok) {
            throw new Error(`createTextElement failed: ${result.error}`);
        }

        expect(result.document.rootIds).toEqual(["text-1"]);
        expect(result.document.elements["text-1"]).toEqual(element);

        expect(previousDocument.rootIds).toEqual([]);
        expect(previousDocument.elements).toEqual({});
    });

    it("rejects duplicate IDs", () => {
        const firstResult = createTextElement(
            createEmptyDocument(),
            textElement(),
        );

        if (!firstResult.ok) {
            throw new Error(`createTextElement failed: ${firstResult.error}`);
        }

        const duplicateResult = createTextElement(
            firstResult.document,
            textElement("text-1"),
        );

        expect(duplicateResult).toEqual({
            ok: false,
            error: "duplicate-id",
        });

        expect(firstResult.document.rootIds).toEqual(["text-1"]);
        expect(Object.keys(firstResult.document.elements)).toHaveLength(1);
    });

    it("rejects zero-dimensions", () => {
        const result = createTextElement(
            createEmptyDocument(),
            textElement("zero-dimensions", {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            }),
        );

        expect(result).toEqual({
            ok: false,
            error: "invalid-rectangle",
        });
    });

    it("rejects negative-dimensions", () => {
        const result = createTextElement(
            createEmptyDocument(),
            textElement("zero-dimensions", {
                x: 0,
                y: 0,
                width: -10,
                height: -200,
            }),
        );

        expect(result).toEqual({
            ok: false,
            error: "invalid-rectangle",
        });
    });

    it("survives a JSON round trip", () => {
        const result = createTextElement(createEmptyDocument(), textElement());

        if (!result.ok) {
            throw new Error(`createTextElement failed: ${result.error}`);
        }

        const serialisedDocument = JSON.stringify(result.document);
        const parseDocument: unknown = JSON.parse(serialisedDocument);

        expect(parseDocument).toEqual(result.document);
    });
});
