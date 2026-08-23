import { describe, expect, it } from "vitest";

import type { CanvasElement } from "../elements/CanvasElement";

import { textElement } from "../../application/commands/element/test/testFactory";
import { addElement, createEmptyDocument, replaceElement } from "./DotDocument";

describe("addElement", () => {
    it("rejects an invalid element at runtime", () => {
        const invalidElement = {} as unknown as CanvasElement;

        const result = addElement(createEmptyDocument(), invalidElement);

        expect(result).toEqual({ ok: false, error: "invalid-element" });
    });
});

describe("replaceElement", () => {
    it("rejects an invalid element at runtime", () => {
        const invalidElement = {} as unknown as CanvasElement;

        const result = replaceElement(createEmptyDocument(), invalidElement);

        expect(result).toEqual({ ok: false, error: "invalid-element" });
    });

    it("rejects an invalid ID at runtime", () => {
        const result = replaceElement(
            {
                schemaVersion: 1,
                rootIds: ["text-1"],
                elements: {
                    "text-1": textElement(),
                },
            },
            textElement("invalid-id"),
        );

        expect(result).toEqual({ ok: false, error: "invalid-id" });
    });
});
