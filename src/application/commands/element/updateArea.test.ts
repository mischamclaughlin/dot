import { describe, expect, it } from "vitest";

import type { Rect } from "../../../domain/geometry/Rect";
import { createEmptyDocument } from "../../../domain/document/DotDocument";
import { textElement } from "../../../test/fixtures/textElement";
import { createTextElement } from "./textElement/create";
import { updateArea } from "./updateArea";

describe("updateArea", () => {
    it("updates a CanvasElement area without changing the original document", () => {
        const create = createTextElement(createEmptyDocument(), textElement());
        if (!create.ok) {
            throw new Error(`createTextElement error: ${create.error}`);
        }

        const previousDocument = create.document;
        const updated = updateArea(previousDocument, "text-1", {
            x: 0,
            y: 0,
            width: 10,
            height: 20,
        });

        if (!updated.ok) {
            throw new Error(`updateArea error: ${updated.error}`);
        }

        expect(previousDocument.elements["text-1"].rect).toEqual({
            x: 0,
            y: 0,
            width: 10,
            height: 10,
        });
        expect(updated.document.elements["text-1"].rect).toEqual({
            x: 0,
            y: 0,
            width: 10,
            height: 20,
        });
    });

    it("only updates the requested CanvasElement", () => {
        const first = createTextElement(createEmptyDocument(), textElement());
        if (!first.ok) {
            throw new Error(`createTextElement error: ${first.error}`);
        }

        const second = createTextElement(first.document, textElement("text-2"));
        if (!second.ok) {
            throw new Error(`createTextElement error: ${second.error}`);
        }

        const updated = updateArea(second.document, "text-1", {
            x: 0,
            y: 0,
            width: 10,
            height: 20,
        });
        if (!updated.ok) {
            throw new Error(`updateArea error: ${updated.error}`);
        }

        expect(updated.document.rootIds).toEqual(["text-1", "text-2"]);
        expect(updated.document.elements["text-1"].rect).toEqual({
            x: 0,
            y: 0,
            width: 10,
            height: 20,
        });
        expect(updated.document.elements["text-2"].rect).toEqual({
            x: 0,
            y: 0,
            width: 10,
            height: 10,
        });
    });

    it("clones the supplied CanvasElement", () => {
        const create = createTextElement(createEmptyDocument(), textElement());
        if (!create.ok) {
            throw new Error(`createTextElement error: ${create.error}`);
        }

        const requestedRect = {
            x: 10,
            y: 10,
            width: 20,
            height: 20,
        } satisfies Rect;

        const updated = updateArea(create.document, "text-1", requestedRect);
        if (!updated.ok) {
            throw new Error(`updateArea error: ${updated.error}`);
        }

        requestedRect.height = 999;

        expect(updated.document.elements["text-1"].rect).toEqual({
            x: 10,
            y: 10,
            width: 20,
            height: 20,
        });
        expect(updated.document.elements["text-1"].rect).not.toBe(
            requestedRect,
        );
    });

    it("reject invalid IDs", () => {
        const result = updateArea(createEmptyDocument(), "invalid-id", {
            x: 0,
            y: 0,
            width: 10,
            height: 20,
        });

        expect(result).toEqual({
            ok: false,
            error: "invalid-id",
        });
    });

    it("reject invalid invalid rectagnle", () => {
        const create = createTextElement(
            createEmptyDocument(),
            textElement("invalid-rectangle"),
        );
        if (!create.ok) {
            throw new Error(`createTextElement error: ${create.error}`);
        }

        const result = updateArea(create.document, "invalid-rectangle", {
            x: 0,
            y: 0,
            width: -10,
            height: 20,
        });

        expect(result).toEqual({
            ok: false,
            error: "invalid-rectangle",
        });
    });
});
