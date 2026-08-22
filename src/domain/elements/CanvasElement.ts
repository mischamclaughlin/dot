import type { TextElement } from "./TextElement";

import { cloneTextElement } from "./TextElement";

export type CanvasElement = TextElement;

export function cloneCanvasElement(element: CanvasElement): CanvasElement {
    switch (element.kind) {
        case "text": {
            return cloneTextElement(element);
        }
    }
}
