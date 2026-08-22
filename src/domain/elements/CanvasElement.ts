import { isRecord } from "../validation/isRecord";
import type { TextElement } from "./TextElement";

import { isTextElement, cloneTextElement } from "./TextElement";

export type CanvasElement = TextElement;

export function isCanvasElementRecord(
    value: unknown,
): value is Readonly<Record<string, CanvasElement>> {
    return (
        isRecord(value) &&
        Object.entries(value).every(
            ([id, element]) => isCanvasElement(element) && element.id === id,
        )
    );
}

export function isCanvasElement(value: unknown): value is CanvasElement {
    if (!isRecord(value)) return false;

    switch (value.kind) {
        case "text":
            return isTextElement(value);

        default:
            return false;
    }
}

export function cloneCanvasElement(element: CanvasElement): CanvasElement {
    switch (element.kind) {
        case "text": {
            return cloneTextElement(element);
        }
    }
}
