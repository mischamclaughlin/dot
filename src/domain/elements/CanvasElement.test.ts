import { describe, it, expect } from "vitest";
import { unknownTextElement } from "../test/testFactory";
import { isCanvasElement } from "./CanvasElement";

describe("isCanvasElement", () => {
    it("returns true when valid CanvasElement", () => {
        const isValid = isCanvasElement(unknownTextElement());

        expect(isValid).toEqual(true);
    });

    it("returns false when invalid CanvasElement", () => {
        const isValid = isCanvasElement("invalid CanvasElement");

        expect(isValid).toEqual(false);
    });

    it("returns false when invalid CanvasElement kind", () => {
        const isValid = isCanvasElement(
            unknownTextElement("invalid-kind-id", "invalid-kind"),
        );

        expect(isValid).toEqual(false);
    });
});
