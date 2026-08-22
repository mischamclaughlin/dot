import type {
    DotDocument,
    DotDocumentResult,
    ReplaceElementError,
} from "../../../../domain/document/DotDocument";
import type { TextStyle } from "../../../../domain/elements/TextElement";

import {
    getElementById,
    replaceElement,
} from "../../../../domain/document/DotDocument";

type UpdateStyleError = ReplaceElementError;
type UpdateStyleResult = DotDocumentResult<UpdateStyleError>;

export function updateStyle(
    document: DotDocument,
    elementId: string,
    style: TextStyle,
): UpdateStyleResult {
    const element = getElementById(document, elementId);

    if (!element) {
        return {
            ok: false,
            error: "invalid-id",
        };
    }

    return replaceElement(document, {
        ...element,
        style: style,
    });
}
