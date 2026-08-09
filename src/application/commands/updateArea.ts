import type { DotDocument } from "../../domain/document/DotDocument";
import type { Rect } from "../../domain/geometry/Rect";

export type UpdateAreaResult =
    | {
          ok: true;
          document: DotDocument;
      }
    | {
          ok: false;
          error: "invalid-id";
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
