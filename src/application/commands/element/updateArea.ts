import type {
    DotDocument,
    DotDocumentResult,
} from "../../../domain/document/DotDocument";
import type { Rect } from "../../../domain/geometry/Rect";

import {
    getElementById,
    replaceElement,
} from "../../../domain/document/DotDocument";
import { isValidRect } from "../../../domain/geometry/Rect";

type UpdateAreaError = "invalid-id" | "invalid-rectangle";

export type UpdateAreaResult = DotDocumentResult<UpdateAreaError>;

export function updateArea(
    document: DotDocument,
    elementId: string,
    area: Rect,
): UpdateAreaResult {
    const element = getElementById(document, elementId);

    if (!element) {
        return { ok: false, error: "invalid-id" };
    }

    if (!isValidRect(area)) {
        return {
            ok: false,
            error: "invalid-rectangle",
        };
    }

    return replaceElement(document, {
        ...element,
        rect: area,
    });
}
