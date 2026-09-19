import type {
    DotDocument,
    DotDocumentResult,
    ReplaceElementError,
} from "../../../../domain/document/DotDocument";
import {
    textElementsEqual,
    type TextElement,
} from "../../../../domain/elements/TextElement";

import {
    getElementById,
    replaceElement,
} from "../../../../domain/document/DotDocument";
import { createTextElement, type CreateTextElementError } from "./create";

export type CommitTextElementDraft =
    | {
          mode: "create";
          element: TextElement;
      }
    | {
          mode: "edit";
          originalId: string;
          element: TextElement;
      };

export type CommitTextElementDraftError =
    | ReplaceElementError
    | CreateTextElementError
    | "id-mismatch";

type CommitTextElementDraftResult =
    DotDocumentResult<CommitTextElementDraftError>;

export function commitTextElementDraft(
    document: DotDocument,
    draft: CommitTextElementDraft,
): CommitTextElementDraftResult {
    if (draft.mode === "create") {
        return createTextElement(document, draft.element);
    }

    if (draft.element.id !== draft.originalId) {
        return { ok: false, error: "id-mismatch" };
    }

    const existingElement = getElementById(document, draft.originalId);
    const result = replaceElement(document, draft.element);

    if (!result.ok) {
        return result;
    }

    if (existingElement && textElementsEqual(existingElement, draft.element)) {
        return {
            ok: true,
            document,
        };
    }

    return result;
}
