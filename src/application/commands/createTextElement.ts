import type { DotDocument } from "../../domain/document/DotDocument";
import type { TextElement } from "../../domain/elements/TextElement";

import { isValidRect } from "../../domain/geometry/Rect";

export type CreateTextElementResult =
    | {
          ok: true;
          document: DotDocument;
      }
    | {
          ok: false;
          error: "duplicate-id" | "invalid-rectangle";
      };

export function createTextElement(
    document: DotDocument,
    element: TextElement,
): CreateTextElementResult {
    if (Object.hasOwn(document.elements, element.id)) {
        return {
            ok: false,
            error: "duplicate-id",
        };
    }

    if (!isValidRect(element.rect)) {
        return {
            ok: false,
            error: "invalid-rectangle",
        };
    }

    return {
        ok: true,
        document: {
            ...document,
            rootIds: [...document.rootIds, element.id],
            elements: {
                ...document.elements,
                [element.id]: element,
            },
        },
    };
}
