import type {
    DotDocument,
    DotDocumentResult,
    ReplaceElementError,
} from "../../../../domain/document/DotDocument";

import {
    getElementById,
    replaceElement,
} from "../../../../domain/document/DotDocument";

type UpdateTextError = ReplaceElementError;
type UpdateTextResult = DotDocumentResult<UpdateTextError>;

export function updateText(
    document: DotDocument,
    elementId: string,
    text: string,
): UpdateTextResult {
    const element = getElementById(document, elementId);

    if (!element) {
        return { ok: false, error: "invalid-id" };
    }

    return replaceElement(document, {
        ...element,
        text,
    });
}
