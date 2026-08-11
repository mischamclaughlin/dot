import {
    getElementById,
    type DotDocument,
} from "../../../../domain/document/DotDocument";
import type { TextStyle } from "../../../../domain/elements/TextElement";

export type UpdateStyleResult =
    | {
          ok: true;
          document: DotDocument;
      }
    | {
          ok: false;
          error: "invalid-id";
      };

export function updateStyle(
    document: DotDocument,
    elementId: string,
    style: TextStyle,
): UpdateStyleResult {
    const element = getElementById(document, elementId);

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
                    style,
                },
            },
        },
    };
}
