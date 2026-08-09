import type { DotDocument } from "../../../../domain/document/DotDocument";

export type UpdateTextResult =
    | {
          ok: true;
          document: DotDocument;
      }
    | {
          ok: false;
          error: "invalid-id";
      };

export function updateText(
    document: DotDocument,
    elementId: string,
    text: string,
): UpdateTextResult {
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
                    text,
                },
            },
        },
    };
}
