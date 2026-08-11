import {
    getElementById,
    type DotDocument,
} from "../../../domain/document/DotDocument";

export type DeleteElementResult =
    | {
          ok: true;
          document: DotDocument;
      }
    | {
          ok: false;
          error: "invalid-id";
      };

export function deleteElement(
    document: DotDocument,
    elementId: string,
): DeleteElementResult {
    const element = getElementById(document, elementId);

    if (!element) {
        return {
            ok: false,
            error: "invalid-id",
        };
    }

    const nextElements = { ...document.elements };

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
