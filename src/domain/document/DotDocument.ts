import type { CanvasElement } from "../elements/CanvasElement";
import { cloneTextElement } from "../elements/TextElement";

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

export function addElement(
    document: DotDocument,
    element: CanvasElement,
): DotDocumentResult<"duplicate-id"> {
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
                [element.id]: cloneTextElement(element),
            },
        },
    };
}

export function replaceElement(
    document: DotDocument,
    element: CanvasElement,
): DotDocumentResult<"invalid-id"> {
    if (!Object.hasOwn(document.elements, element.id)) {
        return { ok: false, error: "invalid-id" };
    }

    return {
        ok: true,
        document: {
            ...document,
            elements: {
                ...document.elements,
                [element.id]: cloneTextElement(element),
            },
        },
    };
}

export function removeElement(
    document: DotDocument,
    elementId: string,
): DotDocumentResult<"invalid-id"> {
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
