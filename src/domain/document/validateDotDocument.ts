import type { CanvasElement } from "../elements/CanvasElement";
import type { DotDocument } from "./DotDocument";

import { cloneCanvasElement, isCanvasElement } from "../elements/CanvasElement";
import { isRecord } from "../validation/isRecord";

export type ValidateDocumentError =
    | "invalid-document"
    | "unsupported-schema-version"
    | "invalid-root-ids"
    | "invalid-elements"
    | "root-ids-element-mismatch";

type ValidateDocumentResult =
    | { ok: true; document: DotDocument }
    | { ok: false; error: ValidateDocumentError };

export function validateDocument(input: unknown): ValidateDocumentResult {
    if (!isRecord(input)) {
        return { ok: false, error: "invalid-document" };
    }

    const schemaVersion = Object.hasOwn(input, "schemaVersion")
        ? input.schemaVersion
        : undefined;

    const rootIds = Object.hasOwn(input, "rootIds") ? input.rootIds : undefined;

    const elements = Object.hasOwn(input, "elements")
        ? input.elements
        : undefined;

    if (!isSupportedSchemaVersion(schemaVersion)) {
        return { ok: false, error: "unsupported-schema-version" };
    }

    if (!isRootIds(rootIds)) {
        return { ok: false, error: "invalid-root-ids" };
    }

    if (!isCanvasElementRecord(elements)) {
        return { ok: false, error: "invalid-elements" };
    }

    if (!isRootElementConsistent(rootIds, elements)) {
        return { ok: false, error: "root-ids-element-mismatch" };
    }

    const clonedElements = Object.fromEntries(
        Object.entries(elements).map(([id, element]) => [
            id,
            cloneCanvasElement(element),
        ]),
    );

    return {
        ok: true,
        document: {
            schemaVersion,
            rootIds: [...rootIds],
            elements: clonedElements,
        },
    };
}

function isSupportedSchemaVersion(value: unknown): value is 1 {
    return value === 1;
}

function isRootIds(value: unknown): value is readonly string[] {
    return (
        Array.isArray(value) &&
        value.every(
            (id): id is string =>
                typeof id === "string" && id.trim().length > 0,
        ) &&
        new Set(value).size === value.length
    );
}

function isCanvasElementRecord(
    value: unknown,
): value is Readonly<Record<string, CanvasElement>> {
    return (
        isRecord(value) &&
        Object.entries(value).every(
            ([id, element]) => isCanvasElement(element) && element.id === id,
        )
    );
}

function isRootElementConsistent(
    rootIDs: readonly string[],
    elements: Readonly<Record<string, CanvasElement>>,
): boolean {
    const elementIds = Object.keys(elements);

    return (
        rootIDs.length === elementIds.length &&
        rootIDs.every((id) => Object.hasOwn(elements, id))
    );
}
