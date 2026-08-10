import type { TextElement } from "../../../../domain/elements/TextElement";
import type { Rect } from "../../../../domain/geometry/Rect";

export const textElement = (
    id: string = "text-1",
    rect: Rect = {
        x: 0,
        y: 0,
        width: 10,
        height: 10,
    },
): TextElement => ({
    kind: "text",
    id: id,
    rect: rect,
    text: "Text Element",
    style: {
        fontSize: 10,
        fontWeight: 400,
        foregroundColour: "#fff",
        backgroundColour: "#000",
        textAlign: "left",
    },
});
