import { describe, it, expect } from "vitest";
import { createTextElement } from "./create";
import { textElement } from "../test/testFactory";
import { createEmptyDocument } from "../../../domain/document/DotDocument";
import { updateText } from "./updateText";

describe("updateText", () => {
    it("updates TextElement text content without changing the original document", () => {
        const create = createTextElement(createEmptyDocument(), textElement());
        if (!create.ok) {
            throw new Error(`createTextElement error: ${create.error}`);
        }

        const previousDocument = create.document;

        const update = updateText(previousDocument, "text-1", "New text");
        if (!update.ok) {
            throw new Error(`updateText error: ${update.error}`);
        }

        expect(create.document.rootIds).toEqual(update.document.rootIds);
        expect(previousDocument.elements["text-1"].text).toEqual(
            "Text Element",
        );
        expect(update.document.elements["text-1"].text).toEqual("New text");
    });

    it("updates only the requested TextElement", () => {
        const first = createTextElement(createEmptyDocument(), textElement());
        if (!first.ok) {
            throw new Error(`createTextElement error: ${first.error}`);
        }

        const second = createTextElement(first.document, textElement("text-2"));
        if (!second.ok) {
            throw new Error(`createTextElement error: ${second.error}`);
        }

        const updated = updateText(second.document, "text-1", "New text");
        if (!updated.ok) {
            throw new Error(`createTextElement error: ${updated.error}`);
        }

        expect(updated.document.rootIds).toEqual(["text-1", "text-2"]);
        expect(second.document.elements["text-1"].text).toEqual("Text Element");
        expect(updated.document.elements["text-1"].text).toEqual("New text");
        expect(updated.document.elements["text-2"]).toEqual(
            second.document.elements["text-2"],
        );
    });

    it("rejects invalid-ids", () => {
        const update = updateText(
            createEmptyDocument(),
            "invalid-id",
            "invalid id text",
        );

        expect(update).toEqual({
            ok: false,
            error: "invalid-id",
        });
    });
});
