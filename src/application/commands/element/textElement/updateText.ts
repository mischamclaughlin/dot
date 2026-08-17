import {
    getElementById,
    replaceElement,
    type DotDocument,
    type DotDocumentResult,
} from "../../../../domain/document/DotDocument";

type UpdateTextError = "invalid-id";

export type UpdateTextResult = DotDocumentResult<UpdateTextError>;

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
