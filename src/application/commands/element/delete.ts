import {
    removeElement,
    type DotDocument,
    type DotDocumentResult,
} from "../../../domain/document/DotDocument";

type DotDocumentError = "invalid-id";

export type DeleteElementResult = DotDocumentResult<DotDocumentError>;

export function deleteElement(
    document: DotDocument,
    elementId: string,
): DeleteElementResult {
    return removeElement(document, elementId);
}
