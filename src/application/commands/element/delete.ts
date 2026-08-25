import type {
    DotDocument,
    DotDocumentResult,
    RemoveElementError,
} from "../../../domain/document/DotDocument";

import { removeElement } from "../../../domain/document/DotDocument";

export type DeleteElementError = RemoveElementError;
type DeleteElementResult = DotDocumentResult<DeleteElementError>;

export function deleteElement(
    document: DotDocument,
    elementId: string,
): DeleteElementResult {
    return removeElement(document, elementId);
}
