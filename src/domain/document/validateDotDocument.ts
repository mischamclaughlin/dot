import type { CanvasElement } from "../elements/CanvasElement";
import type { DotDocument } from "./DotDocument";

import {
    cloneCanvasElement,
    isCanvasElementRecord,
} from "../elements/CanvasElement";
import { isRecord } from "../validation/isRecord";

export type ValidateDocumentError =
    | "invalid-document"
    | "unsupported-schema-version"
    | "invalid-root-ids"
    | "invalid-elements"
    | "rootIDs-element-mismatch";

type ValidateDocumentResult =
    | { ok: true; document: DotDocument }
    | { ok: false; error: ValidateDocumentError };

export function validateDocument(input: unknown): ValidateDocumentResult {
    if (!isRecord(input)) {
        return { ok: false, error: "invalid-document" };
    }

    const { schemaVersion, rootIds, elements } = input;

    if (!checkSupportedSchemaVersion(schemaVersion)) {
        return { ok: false, error: "unsupported-schema-version" };
    }

    if (!checkRootIds(rootIds)) {
        return { ok: false, error: "invalid-root-ids" };
    }

    if (!isCanvasElementRecord(elements)) {
        return { ok: false, error: "invalid-elements" };
    }

    if (!checkRootElementConsistency(rootIds, elements)) {
        return { ok: false, error: "rootIDs-element-mismatch" };
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

function checkSupportedSchemaVersion(value: unknown): value is 1 {
    return value === 1;
}

function checkRootIds(value: unknown): value is readonly string[] {
    return (
        Array.isArray(value) &&
        value.every(
            (id): id is string =>
                typeof id === "string" && id.trim().length > 0,
        ) &&
        new Set(value).size === value.length
    );
}

function checkRootElementConsistency(
    rootIDs: readonly string[],
    elements: Readonly<Record<string, CanvasElement>>,
): boolean {
    const elementIds = Object.keys(elements);

    return (
        rootIDs.length === elementIds.length &&
        rootIDs.every((id) => Object.hasOwn(elements, id))
    );
}
