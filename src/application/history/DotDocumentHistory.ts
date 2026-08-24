import { type DotDocument } from "../../domain/document/DotDocument";

export type DocumentHistory = Readonly<{
    past: readonly DotDocument[];
    present: DotDocument;
    future: readonly DotDocument[];
}>;

export function createHistory(document: DotDocument): DocumentHistory {
    return {
        past: [],
        present: document,
        future: [],
    };
}

export function commitHistory(
    history: DocumentHistory,
    document: DotDocument,
): DocumentHistory {
    if (document === history.present) {
        return history;
    }

    return {
        past: [...history.past, history.present],
        present: document,
        future: [],
    };
}

export function undoHistory(history: DocumentHistory) {
    const previous = history.past.at(-1);

    if (!previous) {
        return history;
    }

    return {
        past: history.past.slice(0, -1),
        present: previous,
        future: [history.present, ...history.future],
    };
}

export function redoHistory(history: DocumentHistory) {
    const next = history.future.at(0);

    if (!next) {
        return history;
    }

    return {
        past: [...history.past, history.present],
        present: next,
        future: history.future.slice(1),
    };
}
