import type { CanvasElement } from "../elements/CanvasElement";

import { cloneCanvasElement, isCanvasElement } from "../elements/CanvasElement";

export type DotDocument = Readonly<{
    schemaVersion: 1;
    rootIds: readonly string[];
    elements: Readonly<Record<string, CanvasElement>>;
}>;

export type DotDocumentResult<ErrorType extends string> =
    | Readonly<{ ok: true; document: DotDocument }>
    | Readonly<{ ok: false; error: ErrorType }>;

export function createEmptyDocument(): DotDocument {
    return {
        schemaVersion: 1,
        rootIds: [],
        elements: {},
    };
}

export function getElementById(
    document: DotDocument,
    elementId: string,
): CanvasElement | undefined {
    return Object.prototype.hasOwnProperty.call(document.elements, elementId)
        ? document.elements[elementId]
        : undefined;
}

export type AddElementError = "duplicate-id" | "invalid-element";
export type AddElementResult = DotDocumentResult<AddElementError>;

export function addElement(
    document: DotDocument,
    element: CanvasElement,
): AddElementResult {
    if (!isCanvasElement(element)) {
        return { ok: false, error: "invalid-element" };
    }

    if (Object.hasOwn(document.elements, element.id)) {
        return {
            ok: false,
            error: "duplicate-id",
        };
    }

    return {
        ok: true,
        document: {
            ...document,
            rootIds: [...document.rootIds, element.id],
            elements: {
                ...document.elements,
                [element.id]: cloneCanvasElement(element),
            },
        },
    };
}

export type ReplaceElementError = "invalid-element" | "invalid-id";
export type ReplaceElementResult = DotDocumentResult<ReplaceElementError>;

export function replaceElement(
    document: DotDocument,
    element: CanvasElement,
): ReplaceElementResult {
    if (!isCanvasElement(element)) {
        return { ok: false, error: "invalid-element" };
    }

    if (!Object.hasOwn(document.elements, element.id)) {
        return { ok: false, error: "invalid-id" };
    }

    return {
        ok: true,
        document: {
            ...document,
            elements: {
                ...document.elements,
                [element.id]: cloneCanvasElement(element),
            },
        },
    };
}

export type RemoveElementError = "invalid-id";
export type RemoveElementResult = DotDocumentResult<RemoveElementError>;

export function removeElement(
    document: DotDocument,
    elementId: string,
): RemoveElementResult {
    if (!Object.hasOwn(document.elements, elementId)) {
        return { ok: false, error: "invalid-id" };
    }

    const elements = { ...document.elements };
    delete elements[elementId];

    return {
        ok: true,
        document: {
            ...document,
            rootIds: document.rootIds.filter((id) => id !== elementId),
            elements,
        },
    };
}
