import { describe, expect, it } from "vitest";

import { createEmptyDocument } from "../../../domain/document/DotDocument";
import { copyElement } from "./copy";
import { textElement } from "../../../test/fixtures/textElement";
import { createTextElement } from "./textElement/create";

describe("copyElement", () => {
    it("copies a CanvasElement without changing the original document", () => {
        const created = createTextElement(createEmptyDocument(), textElement());

        if (!created.ok) {
            throw new Error(`createTextElement error: ${created.error}`);
        }

        const previousDocument = created.document;
        const copied = copyElement(previousDocument, "text-1", "text-2");

        if (!copied.ok) {
            throw new Error(`copyElement error: ${copied.error}`);
        }

        expect(copied.document.rootIds).toEqual(["text-1", "text-2"]);

        expect(copied.document.elements["text-2"]).toEqual({
            ...previousDocument.elements["text-1"],
            id: "text-2",
            rect: {
                x: 10,
                y: 10,
                width: 10,
                height: 10,
            },
        });

        expect(previousDocument.rootIds).toEqual(["text-1"]);
        expect(previousDocument.elements["text-2"]).toBeUndefined();
        expect(previousDocument.elements["text-1"].rect).toEqual({
            x: 0,
            y: 0,
            width: 10,
            height: 10,
        });
    });

    it("copies only the intended CanvasElement", () => {
        const first = createTextElement(createEmptyDocument(), textElement());

        if (!first.ok) {
            throw new Error(`createTextElement error: ${first.error}`);
        }

        const second = createTextElement(
            first.document,
            textElement("copy", {
                x: 100,
                y: 100,
                width: 200,
                height: 200,
            }),
        );

        if (!second.ok) {
            throw new Error(`createTextElement error: ${second.error}`);
        }

        const previousDocument = second.document;
        const sourceElement = previousDocument.elements["copy"];
        const unrelatedElement = previousDocument.elements["text-1"];

        const copied = copyElement(previousDocument, "copy", "paste");

        if (!copied.ok) {
            throw new Error(`copyElement error: ${copied.error}`);
        }

        expect(copied.document.rootIds).toEqual(["text-1", "copy", "paste"]);

        expect(copied.document.elements["paste"]).toEqual({
            ...sourceElement,
            id: "paste",
            rect: {
                x: 300,
                y: 300,
                width: 200,
                height: 200,
            },
        });

        expect(copied.document.elements["text-1"]).toEqual(unrelatedElement);

        expect(previousDocument.rootIds).toEqual(["text-1", "copy"]);
        expect(previousDocument.elements["paste"]).toBeUndefined();
    });

    it("rejects invalid IDs", () => {
        const copy = copyElement(
            createEmptyDocument(),
            "invalid-id",
            "very-invalid-id",
        );

        expect(copy).toEqual({
            ok: false,
            error: "invalid-id",
        });
    });

    it("rejects duplicate IDs", () => {
        const create = createTextElement(
            createEmptyDocument(),
            textElement("same-same"),
        );
        if (!create.ok) {
            throw new Error(`createTextElement error: ${create.error}`);
        }

        const copy = copyElement(create.document, "same-same", "same-same");

        expect(copy).toEqual({
            ok: false,
            error: "duplicate-id",
        });
    });
});
