import type {
    DotDocument,
    DotDocumentResult,
    ReplaceElementError,
} from "../../../../domain/document/DotDocument";
import type { TextElement } from "../../../../domain/elements/TextElement";

import { replaceElement } from "../../../../domain/document/DotDocument";
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

    return replaceElement(document, draft.element);
}
