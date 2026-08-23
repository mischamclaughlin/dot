import { isRecord } from "../validation/isRecord";
import type { TextElement } from "./TextElement";

import { cloneTextElement, isTextElement } from "./TextElement";

export type CanvasElement = TextElement;

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
