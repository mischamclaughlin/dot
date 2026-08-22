import {
    removeElement,
    type DotDocument,
    type DotDocumentResult,
} from "../../../domain/document/DotDocument";

type DeleteElementError = "invalid-id";

export type DeleteElementResult = DotDocumentResult<DeleteElementError>;

export function deleteElement(
    document: DotDocument,
    elementId: string,
): DeleteElementResult {
    return removeElement(document, elementId);
}
