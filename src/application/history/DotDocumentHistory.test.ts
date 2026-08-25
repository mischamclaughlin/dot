import { describe, expect, it } from "vitest";
import { createEmptyDocument } from "../../domain/document/DotDocument";
import {
    commitHistory,
    createHistory,
    redoHistory,
    undoHistory,
} from "./DotDocumentHistory";

describe("createHistory", () => {
    it("creates history with the supplied document as present", () => {
        const document = createEmptyDocument();

        const history = createHistory(document);

        expect(history).toEqual({
            past: [],
            present: document,
            future: [],
        });
        expect(history.present).toBe(document);
    });
});

describe("commitHistory", () => {
    it("moves the current document into past and makes the supplied document present", () => {
        const initialDocument = createEmptyDocument();
        const nextDocument = { ...initialDocument };

        const history = createHistory(initialDocument);

        const commitedHistory = commitHistory(history, nextDocument);

        expect(commitedHistory).toEqual({
            past: [initialDocument],
            present: nextDocument,
            future: [],
        });
        expect(commitedHistory.past.at(-1)).toBe(initialDocument);
        expect(commitedHistory.present).toBe(nextDocument);

        expect(history).toEqual({
            past: [],
            present: initialDocument,
            future: [],
        });
    });

    it("return history if document is present", () => {
        const initialDocument = createEmptyDocument();

        const history = createHistory(initialDocument);

        const commitedHistory = commitHistory(history, initialDocument);

        expect(commitedHistory).toEqual({
            past: [],
            present: initialDocument,
            future: [],
        });
        expect(commitedHistory.past).toEqual([]);
        expect(commitedHistory.present).toEqual(initialDocument);

        expect(history).toEqual({
            past: [],
            present: initialDocument,
            future: [],
        });
    });
});

describe("undoHistory", () => {
    it("moves the past document to the present and makes the present document future", () => {
        const initialDocument = createEmptyDocument();
        const nextDocument = { ...initialDocument };

        const history = createHistory(initialDocument);
        const commitedHistory = commitHistory(history, nextDocument);

        const undoDocHistory = undoHistory(commitedHistory);

        expect(undoDocHistory).toEqual({
            past: [],
            present: initialDocument,
            future: [nextDocument],
        });
        expect(undoDocHistory.present).toBe(initialDocument);
        expect(undoDocHistory.future.at(0)).toBe(nextDocument);
    });

    it("clears the previous redo branch when committing after undo", () => {
        const initialDocument = createEmptyDocument();
        const nextDocument = { ...initialDocument };
        const branchedDocument = { ...initialDocument };

        const history = createHistory(initialDocument);
        const commitedHistory = commitHistory(history, nextDocument);
        const undoneHistory = undoHistory(commitedHistory);

        expect(undoneHistory).toEqual({
            past: [],
            present: initialDocument,
            future: [nextDocument],
        });

        const branchedHistory = commitHistory(undoneHistory, branchedDocument);

        expect(branchedHistory).toEqual({
            past: [initialDocument],
            present: branchedDocument,
            future: [],
        });
        expect(branchedHistory.present).toBe(branchedDocument);
    });

    it("return history if there's no past", () => {
        const initialDocument = createEmptyDocument();

        const history = createHistory(initialDocument);

        const undoDocHistory = undoHistory(history);

        expect(undoDocHistory).toEqual({
            past: [],
            present: initialDocument,
            future: [],
        });
        expect(undoDocHistory.past).toEqual([]);
        expect(undoDocHistory.present).toEqual(initialDocument);

        expect(history).toEqual({
            past: [],
            present: initialDocument,
            future: [],
        });
    });
});

describe("redoHistory", () => {
    it("moves the past document to the present and makes the present document future", () => {
        const initialDocument = createEmptyDocument();
        const nextDocument = { ...initialDocument };

        const history = createHistory(initialDocument);
        const commitedHistory = commitHistory(history, nextDocument);

        const undoDocHistory = undoHistory(commitedHistory);
        const redoDocHistory = redoHistory(undoDocHistory);

        expect(redoDocHistory).toEqual({
            past: [initialDocument],
            present: nextDocument,
            future: [],
        });
        expect(redoDocHistory.present).toBe(nextDocument);
        expect(redoDocHistory.future).toEqual([]);
    });

    it("redoes documents in the correct order", () => {
        const initialDocument = createEmptyDocument();
        const secondDocument = { ...initialDocument };
        const thirdDocument = { ...initialDocument };

        const history = createHistory(initialDocument);
        const secondHistory = commitHistory(history, secondDocument);
        const thirdHistory = commitHistory(secondHistory, thirdDocument);

        const undoneOnce = undoHistory(thirdHistory);
        const undoneTwice = undoHistory(undoneOnce);

        expect(undoneTwice).toEqual({
            past: [],
            present: initialDocument,
            future: [secondDocument, thirdDocument],
        });

        const redoneOnce = redoHistory(undoneTwice);

        expect(redoneOnce).toEqual({
            past: [initialDocument],
            present: secondDocument,
            future: [thirdDocument],
        });

        const redoneTwice = redoHistory(redoneOnce);

        expect(redoneTwice).toEqual({
            past: [initialDocument, secondDocument],
            present: thirdDocument,
            future: [],
        });
    });

    it("return history if there's no future", () => {
        const initialDocument = createEmptyDocument();

        const history = createHistory(initialDocument);

        const redoDocHistory = redoHistory(history);

        expect(redoDocHistory).toEqual({
            past: [],
            present: initialDocument,
            future: [],
        });
        expect(redoDocHistory.past).toEqual([]);
        expect(redoDocHistory.present).toEqual(initialDocument);

        expect(redoDocHistory).toEqual({
            past: [],
            present: initialDocument,
            future: [],
        });
    });
});
