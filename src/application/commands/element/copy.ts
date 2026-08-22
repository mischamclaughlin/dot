import type {
    DotDocument,
    DotDocumentResult,
} from "../../../domain/document/DotDocument";
import {
    addElement,
    getElementById,
} from "../../../domain/document/DotDocument";
import type { CanvasElement } from "../../../domain/elements/CanvasElement";

type CopyElementError = "invalid-id" | "duplicate-id";

export type CopyElementResult = DotDocumentResult<CopyElementError>;

export function copyElement(
    document: DotDocument,
    elementId: string,
    newElementId: string,
): CopyElementResult {
    const element = getElementById(document, elementId);

    if (!element) {
        return {
            ok: false,
            error: "invalid-id",
        };
    }

    const copy: CanvasElement = {
        ...element,
        id: newElementId,
        rect: {
            ...element.rect,
            x: element.rect.x + element.rect.width,
            y: element.rect.y + element.rect.height,
        },
    };

    return addElement(document, copy);
}
