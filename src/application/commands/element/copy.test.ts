import { describe, it, expect } from "vitest";
import { createTextElement } from "./textElement/create";
import { createEmptyDocument } from "../../../domain/document/DotDocument";
import { textElement } from "./test/testFactory";
import { copyElement } from "./copy";

describe("copyElement", () => {
    it("copies a CanvasElement without changing the original document", () => {
        const create = createTextElement(createEmptyDocument(), textElement());
        if (!create.ok) {
            throw new Error(`createTextElement eror: ${create.error}`);
        }

        const copy = copyElement(create.document, "text-1", "text-2");
        if (!copy.ok) {
            throw new Error(`copyElement error: ${copy.error}`);
        }

        expect(copy.document.rootIds).toEqual(["text-1", "text-2"]);
    });
});
