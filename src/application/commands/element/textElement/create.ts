import type {
    DotDocument,
    DotDocumentResult,
} from "../../../../domain/document/DotDocument";
import { addElement } from "../../../../domain/document/DotDocument";
import type { TextElement } from "../../../../domain/elements/TextElement";

import { isValidRect } from "../../../../domain/geometry/Rect";

type CreateTextElementError = "duplicate-id" | "invalid-rectangle";

export type CreateTextElementResult = DotDocumentResult<CreateTextElementError>;

export function createTextElement(
    document: DotDocument,
    element: TextElement,
): CreateTextElementResult {
    if (!isValidRect(element.rect)) {
        return {
            ok: false,
            error: "invalid-rectangle",
        };
    }

    return addElement(document, element);
}
