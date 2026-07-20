import type { AreaStyle } from "../types/DotGridTypes";

export const variantTitle = {
    fontSize: "2em",
    fontWeight: 700,
} satisfies AreaStyle;

export const variantSubTitle = {
    fontSize: "1.17em",
    fontWeight: "bold",
} satisfies AreaStyle;

export const variantHeading = {
    fontSize: "1.5em",
    fontWeight: "bold",
} satisfies AreaStyle;

export const variantSubHeading = {
    fontSize: "1em",
    fontWeight: "bold",
} satisfies AreaStyle;

export const variantBody = {
    fontSize: "1em",
    fontWeight: 400,
} satisfies AreaStyle;

export const textAlignLeft = {
    textAlign: "left",
} satisfies AreaStyle;

export const textAlignRight = {
    textAlign: "right",
} satisfies AreaStyle;

export const textAlignCenter = {
    textAlign: "center",
} satisfies AreaStyle;

export const textAlignJustify = {
    textAlign: "justify",
} satisfies AreaStyle;

export const contentAlignStart = {
    alignContent: "start",
} satisfies AreaStyle;

export const contentAlignCenter = {
    alignContent: "center",
} satisfies AreaStyle;

export const contentAlignEnd = {
    alignContent: "end",
} satisfies AreaStyle;

//------------------------------------------------------------------------------
// Defaults
export const defaultVariant = variantBody;
export const defaultTextAlign = textAlignLeft;
export const defaultContentAlign = contentAlignStart;

export const defaultBackgroundColour = {
    backgroundColor: "#faf4ed",
} satisfies AreaStyle;

export const defaultForegroundColour = {
    color: "#464261",
} satisfies AreaStyle;

export const defaultStyle: AreaStyle = {
    ...defaultVariant,
    ...defaultTextAlign,
    ...defaultContentAlign,
    ...defaultForegroundColour,
    ...defaultBackgroundColour,
};
