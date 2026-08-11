import {
    getElementById,
    type DotDocument,
} from "../../../domain/document/DotDocument";
import type { CanvasElement } from "../../../domain/elements/CanvasElement";

export type CopyElementResult =
    | {
          ok: true;
          document: DotDocument;
      }
    | {
          ok: false;
          error: "invalid-id";
      }
    | {
          ok: false;
          error: "duplicate-id";
      };

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

    if (Object.hasOwn(document.elements, newElementId)) {
        return {
            ok: false,
            error: "duplicate-id",
        };
    }

    const elementCopy: CanvasElement = {
        ...element,
        id: newElementId,
        style: { ...element.style },
        rect: {
            ...element.rect,
            x: element.rect.x + element.rect.width,
            y: element.rect.y + element.rect.height,
        },
    };

    return {
        ok: true,
        document: {
            ...document,
            rootIds: [...document.rootIds, newElementId],
            elements: {
                ...document.elements,
                [newElementId]: elementCopy,
            },
        },
    };
}
