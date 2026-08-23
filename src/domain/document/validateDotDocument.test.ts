import { describe, expect, it } from "vitest";

import { unknownDocument, unknownTextElement } from "../test/testFactory";
import { validateDocument } from "./validateDotDocument";

describe("validateDocument", () => {
    it("accepts an empty valid document", () => {
        const validDoc = validateDocument(unknownDocument());
        if (!validDoc.ok) {
            throw new Error(`validateDocument error: ${validDoc.error}`);
        }

        expect(validDoc.ok).toEqual(true);
        expect(validDoc.document).toEqual({
            schemaVersion: 1,
            rootIds: [],
            elements: {},
        });
    });

    it("accepts a populated valid document", () => {
        const element = unknownTextElement();

        const validDoc = validateDocument(
            unknownDocument(1, ["text-1"], { "text-1": element }),
        );
        if (!validDoc.ok) {
            throw new Error(`validateDocument error: ${validDoc.error}`);
        }

        expect(validDoc.ok).toEqual(true);
        expect(validDoc.document).toEqual({
            schemaVersion: 1,
            rootIds: ["text-1"],
            elements: { "text-1": element },
        });
    });

    it("clones an accepted document", () => {
        const rootIDs = ["text-1"];
        const element = unknownTextElement();
        const elements = { "text-1": element };

        const validDoc = validateDocument(
            unknownDocument(1, rootIDs, elements),
        );
        if (!validDoc.ok) {
            throw new Error(`validateDocument error: ${validDoc.error}`);
        }

        rootIDs.push("corruption");

        expect(validDoc.ok).toEqual(true);
        expect(validDoc.document.rootIds).toEqual(["text-1"]);
    });

    it("rejects an invalid document", () => {
        const validDoc = validateDocument("not a document");
        if (validDoc.ok) {
            throw new Error(`validateDocument is good: ${validDoc.ok}`);
        }

        expect(validDoc.ok).toEqual(false);
        expect(validDoc.error).toEqual("invalid-document");
    });

    it.each([
        {
            field: "schemaVersion",
            input: { rootIds: [], elements: {} },
            error: "unsupported-schema-version",
        },
        {
            field: "rootIds",
            input: { schemaVersion: 1, elements: {} },
            error: "invalid-root-ids",
        },
        {
            field: "elements",
            input: { schemaVersion: 1, rootIds: [] },
            error: "invalid-elements",
        },
    ])("rejects a document missing $field", ({ input, error }) => {
        expect(validateDocument(input)).toEqual({
            ok: false,
            error,
        });
    });

    describe("validates each section of the document and follows the correct error flow", () => {
        it("rejects an unsupported schema version", () => {
            const validDoc = validateDocument(unknownDocument(2));
            if (validDoc.ok) {
                throw new Error(`validateDocument is good: ${validDoc.ok}`);
            }

            expect(validDoc.ok).toEqual(false);
            expect(validDoc.error).toEqual("unsupported-schema-version");
        });

        describe("rejects invalid rootIDs and follows the correct error flow", () => {
            it("reject when it is not an array", () => {
                const validDoc = validateDocument(
                    unknownDocument(1, "not an array"),
                );
                if (validDoc.ok) {
                    throw new Error(`validateDocument is good: ${validDoc.ok}`);
                }

                expect(validDoc.ok).toEqual(false);
                expect(validDoc.error).toEqual("invalid-root-ids");
            });

            it("reject when it is not a string array", () => {
                const validDoc = validateDocument(unknownDocument(1, [1]));
                if (validDoc.ok) {
                    throw new Error(`validateDocument is good: ${validDoc.ok}`);
                }

                expect(validDoc.ok).toEqual(false);
                expect(validDoc.error).toEqual("invalid-root-ids");
            });

            it("reject when it is an empty string array", () => {
                const validDoc = validateDocument(
                    unknownDocument(1, ["", " "]),
                );
                if (validDoc.ok) {
                    throw new Error(`validateDocument is good: ${validDoc.ok}`);
                }

                expect(validDoc.ok).toEqual(false);
                expect(validDoc.error).toEqual("invalid-root-ids");
            });

            it("reject when it is an array with duplicates", () => {
                const validDoc = validateDocument(
                    unknownDocument(1, ["1", "1"]),
                );
                if (validDoc.ok) {
                    throw new Error(`validateDocument is good: ${validDoc.ok}`);
                }

                expect(validDoc.ok).toEqual(false);
                expect(validDoc.error).toEqual("invalid-root-ids");
            });
        });
    });

    describe("rejects invalid CanvasElement and follows the correct error flow", () => {
        it("rejects when it is not a record", () => {
            const validDoc = validateDocument(
                unknownDocument(1, [], "not a record"),
            );
            if (validDoc.ok) {
                throw new Error(`validateDocument is good: ${validDoc.ok}`);
            }

            expect(validDoc.ok).toEqual(false);
            expect(validDoc.error).toEqual("invalid-elements");
        });

        it("rejects when it is not a record of CanvasElements", () => {
            const validDoc = validateDocument(
                unknownDocument(1, [], { badRecord: 666 }),
            );
            if (validDoc.ok) {
                throw new Error(`validateDocument is good: ${validDoc.ok}`);
            }

            expect(validDoc.ok).toEqual(false);
            expect(validDoc.error).toEqual("invalid-elements");
        });

        it("rejects when it is has mismatched keys and IDs", () => {
            const validDoc = validateDocument(
                unknownDocument(1, [], {
                    "text-1": unknownTextElement("text-2"),
                }),
            );
            if (validDoc.ok) {
                throw new Error(`validateDocument is good: ${validDoc.ok}`);
            }

            expect(validDoc.ok).toEqual(false);
            expect(validDoc.error).toEqual("invalid-elements");
        });
    });

    describe("rejects a mismatch between rootIds and CanvasElement Ids", () => {
        it("reject when the rootIds length don't match the elements keys length", () => {
            const validDoc = validateDocument(
                unknownDocument(1, [], {
                    "text-1": unknownTextElement("text-1"),
                }),
            );
            if (validDoc.ok) {
                throw new Error(`validateDocument is good: ${validDoc.ok}`);
            }

            expect(validDoc.ok).toEqual(false);
            expect(validDoc.error).toEqual("root-ids-element-mismatch");
        });

        it("reject when the rootIds don't equal elements keys", () => {
            const validDoc = validateDocument(
                unknownDocument(1, ["text-2"], {
                    "text-1": unknownTextElement("text-1"),
                }),
            );
            if (validDoc.ok) {
                throw new Error(`validateDocument is good: ${validDoc.ok}`);
            }

            expect(validDoc.ok).toEqual(false);
            expect(validDoc.error).toEqual("root-ids-element-mismatch");
        });
    });
});
