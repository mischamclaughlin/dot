import type {
    AddElementError,
    DotDocument,
    DotDocumentResult,
} from "../../../../domain/document/DotDocument";
import type { TextElement } from "../../../../domain/elements/TextElement";

import { addElement } from "../../../../domain/document/DotDocument";
import { isRect } from "../../../../domain/geometry/Rect";

export type CreateTextElementError = AddElementError | "invalid-rectangle";
type CreateTextElementResult = DotDocumentResult<CreateTextElementError>;

export function createTextElement(
    document: DotDocument,
    element: TextElement,
): CreateTextElementResult {
    if (!isRect(element.rect)) {
        return {
            ok: false,
            error: "invalid-rectangle",
        };
    }

    return addElement(document, element);
}
