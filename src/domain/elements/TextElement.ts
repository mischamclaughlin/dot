import { isRect, type Rect } from "../geometry/Rect";
import { hasOwnProperties, isRecord } from "../validation/isRecord";

export type TextStyle = Readonly<{
    fontSize: number;
    fontWeight: number;
    foregroundColour: string;
    backgroundColour: string;
    textAlign: TextAlign;
}>;

export type TextAlign = "left" | "center" | "right";

export type TextElement = Readonly<{
    kind: "text";
    id: string;
    rect: Rect;
    text: string;
    style: TextStyle;
}>;

export function isTextElement(value: unknown): value is TextElement {
    if (
        !isRecord(value) ||
        !hasOwnProperties(value, ["id", "kind", "rect", "text", "style"])
    )
        return false;

    return (
        typeof value.id === "string" &&
        value.id.trim().length > 0 &&
        value.kind === "text" &&
        isRect(value.rect) &&
        typeof value.text === "string" &&
        isTextStyle(value.style)
    );
}

function isTextStyle(value: unknown): value is TextStyle {
    if (
        !isRecord(value) ||
        !hasOwnProperties(value, [
            "fontSize",
            "fontWeight",
            "foregroundColour",
            "backgroundColour",
            "textAlign",
        ])
    )
        return false;

    return (
        typeof value.fontSize === "number" &&
        Number.isFinite(value.fontSize) &&
        value.fontSize > 0 &&
        typeof value.fontWeight === "number" &&
        Number.isFinite(value.fontWeight) &&
        value.fontWeight > 0 &&
        typeof value.foregroundColour === "string" &&
        value.foregroundColour[0] === "#" &&
        typeof value.backgroundColour === "string" &&
        value.backgroundColour[0] === "#" &&
        isTextAlign(value.textAlign)
    );
}

function isTextAlign(value: unknown): value is TextAlign {
    return value === "left" || value === "center" || value === "right";
}

export function cloneTextElement(element: TextElement): TextElement {
    return {
        ...element,
        rect: { ...element.rect },
        style: { ...element.style },
    };
}

export function textElementsEqual(
    first: TextElement,
    second: TextElement,
): boolean {
    return (
        first.id === second.id &&
        first.text === second.text &&
        first.rect.x === second.rect.x &&
        first.rect.y === second.rect.y &&
        first.rect.width === second.rect.width &&
        first.rect.height === second.rect.height &&
        first.style.fontSize === second.style.fontSize &&
        first.style.fontWeight === second.style.fontWeight &&
        first.style.foregroundColour === second.style.foregroundColour &&
        first.style.backgroundColour === second.style.backgroundColour &&
        first.style.textAlign === second.style.textAlign
    );
}
