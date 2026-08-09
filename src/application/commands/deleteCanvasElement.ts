import type { DotDocument } from "../../domain/document/DotDocument";

export type DeleteCanvasElementResult =
    | {
          ok: true;
          document: DotDocument;
      }
    | {
          ok: false;
          error: "invalid-id";
      };

export function deleteCanvasElement(
    document: DotDocument,
    elementId: string,
): DeleteCanvasElementResult {
    if (!Object.hasOwn(document.elements, elementId)) {
        return {
            ok: false,
            error: "invalid-id",
        };
    }

    const nextElements = {
        ...document.elements,
    };

    delete nextElements[elementId];

    return {
        ok: true,
        document: {
            ...document,
            rootIds: document.rootIds.filter((id) => id !== elementId),
            elements: nextElements,
        },
    };
}
