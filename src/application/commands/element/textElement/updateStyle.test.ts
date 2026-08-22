import { describe, it, expect } from "vitest";
import { createTextElement } from "./create";
import { createEmptyDocument } from "../../../../domain/document/DotDocument";
import { textElement } from "../test/testFactory";
import { updateStyle } from "./updateStyle";
import type { TextStyle } from "../../../../domain/elements/TextElement";

describe("updateStyle", () => {
    it("updates the TextElements style without changing the original document", () => {
        const create = createTextElement(createEmptyDocument(), textElement());
        if (!create.ok) {
            throw new Error(`createTextElement error: ${create.error}`);
        }

        const previousDocument = create.document;
        const updated = updateStyle(previousDocument, "text-1", {
            ...previousDocument.elements["text-1"].style,
            fontSize: 20,
        });

        if (!updated.ok) {
            throw new Error(`updatedStyle error: ${updated.error}`);
        }

        expect(updated.document.elements["text-1"].style).toEqual({
            ...previousDocument.elements["text-1"].style,
            fontSize: 20,
        });
        expect(previousDocument.elements["text-1"].style).toEqual({
            ...previousDocument.elements["text-1"].style,
            fontSize: 10,
        });
    });

    it("updates only the requested TextElement", () => {
        const first = createTextElement(
            createEmptyDocument(),
            textElement("text-1"),
        );

        if (!first.ok) {
            throw new Error(`createTextElement error: ${first.error}`);
        }

        const second = createTextElement(first.document, textElement("text-2"));

        if (!second.ok) {
            throw new Error(`createTextElement error: ${second.error}`);
        }

        const previousDocument = second.document;
        const previousTextTwoStyle = previousDocument.elements["text-2"].style;

        const updated = updateStyle(previousDocument, "text-1", {
            ...previousDocument.elements["text-1"].style,
            fontSize: 20,
        });

        if (!updated.ok) {
            throw new Error(`updateStyle error: ${updated.error}`);
        }

        expect(updated.document.elements["text-1"].style.fontSize).toBe(20);
        expect(updated.document.elements["text-2"].style).toEqual(
            previousTextTwoStyle,
        );
        expect(previousDocument.elements["text-1"].style.fontSize).toBe(10);
    });

    it("clones the supplied TextElement", () => {
        const create = createTextElement(createEmptyDocument(), textElement());
        if (!create.ok) {
            throw new Error(`createTextElement error: ${create.error}`);
        }

        const requestedStyle = {
            fontSize: 12,
            fontWeight: 400,
            foregroundColour: "#fff",
            backgroundColour: "#000",
            textAlign: "left",
        } satisfies TextStyle;

        const updated = updateStyle(create.document, "text-1", requestedStyle);
        if (!updated.ok) {
            throw new Error(`updateStyle error: ${updated.error}`);
        }

        requestedStyle.fontSize = 24;

        expect(updated.document.elements["text-1"].style).toEqual({
            fontSize: 12,
            fontWeight: 400,
            foregroundColour: "#fff",
            backgroundColour: "#000",
            textAlign: "left",
        });
        expect(updated.document.elements["text-1"].style).not.toBe(
            requestedStyle,
        );
    });

    it("rejects invalid IDs", () => {
        const initialDocument = createEmptyDocument();
        const updated = updateStyle(initialDocument, "invalid-id", {
            fontSize: 10,
            fontWeight: 400,
            foregroundColour: "#000",
            backgroundColour: "#fff",
            textAlign: "left",
        });

        expect(updated).toEqual({
            ok: false,
            error: "invalid-id",
        });
    });
});
