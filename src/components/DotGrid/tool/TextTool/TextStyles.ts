import type { ItemStyle } from "../../types/DotGridTypes";
// -----------------------------------------------------------------------------

export const variantTitle = {
    fontSize: "2em",
    fontWeight: 700,
} satisfies ItemStyle;

export const variantSubTitle = {
    fontSize: "1.17em",
    fontWeight: "bold",
} satisfies ItemStyle;

export const variantHeading = {
    fontSize: "1.5em",
    fontWeight: "bold",
} satisfies ItemStyle;

export const variantSubHeading = {
    fontSize: "1em",
    fontWeight: "bold",
} satisfies ItemStyle;

export const variantBody = {
    fontSize: "1em",
    fontWeight: 400,
} satisfies ItemStyle;

export const textAlignLeft = {
    textAlign: "left",
} satisfies ItemStyle;

export const textAlignRight = {
    textAlign: "right",
} satisfies ItemStyle;

export const textAlignCenter = {
    textAlign: "center",
} satisfies ItemStyle;

export const textAlignJustify = {
    textAlign: "justify",
} satisfies ItemStyle;

export const contentAlignStart = {
    alignContent: "start",
} satisfies ItemStyle;

export const contentAlignCenter = {
    alignContent: "center",
} satisfies ItemStyle;

export const contentAlignEnd = {
    alignContent: "end",
} satisfies ItemStyle;

export const paddingTop = {
    paddingTop: "0",
} satisfies ItemStyle;

export const paddingRight = {
    paddingRight: "0",
} satisfies ItemStyle;

export const paddingBottom = {
    paddingBottom: "0",
} satisfies ItemStyle;

export const paddingLeft = {
    paddingLeft: "0",
} satisfies ItemStyle;

//------------------------------------------------------------------------------
// Defaults
export const defaultVariant = variantBody;
export const defaultTextAlign = textAlignLeft;
export const defaultContentAlign = contentAlignStart;

export const defaultPadding = {
    ...paddingTop,
    ...paddingRight,
    ...paddingBottom,
    ...paddingLeft,
};

export const defaultBackgroundColour = {
    backgroundColor: "#faf4ed",
} satisfies ItemStyle;

export const defaultForegroundColour = {
    color: "#464261",
} satisfies ItemStyle;

export const defaultStyle: ItemStyle = {
    ...defaultVariant,
    ...defaultTextAlign,
    ...defaultContentAlign,
    ...defaultForegroundColour,
    ...defaultBackgroundColour,
    ...defaultPadding,
};
