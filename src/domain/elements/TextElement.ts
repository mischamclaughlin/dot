import type { Rect } from "../geometry/Rect";

export type TextStyle = Readonly<{
    fontSize: number;
    fontWeight: number;
    foregroundColour: string;
    backgroundColour: string;
    textAlign: "left" | "center" | "right";
}>;

export type TextElement = Readonly<{
    kind: "text";
    id: string;
    rect: Rect;
    text: string;
    style: TextStyle;
}>;
