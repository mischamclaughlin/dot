import type {
    DotDocument,
    DotDocumentResult,
    ReplaceElementError,
} from "../../../domain/document/DotDocument";
import type { Rect } from "../../../domain/geometry/Rect";

import {
    getElementById,
    replaceElement,
} from "../../../domain/document/DotDocument";
import { isRect } from "../../../domain/geometry/Rect";

export type UpdateAreaError = ReplaceElementError | "invalid-rectangle";
type UpdateAreaResult = DotDocumentResult<UpdateAreaError>;

export function updateArea(
    document: DotDocument,
    elementId: string,
    area: Rect,
): UpdateAreaResult {
    const element = getElementById(document, elementId);

    if (!element) {
        return { ok: false, error: "invalid-id" };
    }

    if (!isRect(area)) {
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
