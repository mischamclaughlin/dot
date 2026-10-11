import type { CSSProperties } from "react";
import type { TextStyle } from "../../../../domain/elements/TextElement";
import type { Rect } from "../../../../domain/geometry/Rect";

export const textStyle = (style: TextStyle): CSSProperties => {
  return {
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    textAlign: style.textAlign,
    color: style.foregroundColour,
    backgroundColor: style.backgroundColour,
  };
};

export const rectStyle = (rect: Rect): CSSProperties => {
  return {
    position: "absolute",
    left: rect.x,
    top: rect.y,
    width: rect.width,
    height: rect.height,
  };
};
