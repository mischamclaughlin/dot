import type { DotDocument } from "../../../domain/document/DotDocument";
import { isValidRect, type Rect } from "../../../domain/geometry/Rect";

export type UpdateAreaResult =
    | {
          ok: true;
          document: DotDocument;
      }
    | {
          ok: false;
          error: "invalid-id" | "invalid-rectangle";
      };

export function updateArea(
    document: DotDocument,
    elementId: string,
    area: Rect,
): UpdateAreaResult {
    const element = document.elements[elementId];

    if (!element) {
        return {
            ok: false,
            error: "invalid-id",
        };
    }

    if (!isValidRect(area)) {
        return {
            ok: false,
            error: "invalid-rectangle",
        };
    }

    return {
        ok: true,
        document: {
            ...document,
            elements: {
                ...document.elements,
                [elementId]: {
                    ...element,
                    rect: area,
                },
            },
        },
    };
}
