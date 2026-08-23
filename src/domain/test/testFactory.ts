export function unknownDocument(
    schemaVersion: unknown = 1,
    rootIDs: unknown = [],
    elements: unknown = {},
): unknown {
    return {
        schemaVersion: schemaVersion,
        rootIds: rootIDs,
        elements: elements,
    };
}

export const unknownTextElement = (
    id: unknown = "text-1",
    kind: unknown = "text",
    rect: unknown = {
        x: 0,
        y: 0,
        width: 10,
        height: 10,
    },
    text: unknown = "Unknown Text Element",
    style: unknown = {
        fontSize: 10,
        fontWeight: 400,
        foregroundColour: "#fff",
        backgroundColour: "#000",
        textAlign: "left",
    },
): unknown => ({
    kind: kind,
    id: id,
    rect: rect,
    text: text,
    style: style,
});

export const unknownTextStyle = (
    fontSize: unknown = 10,
    fontWeight: unknown = 400,
    foregroundColour: unknown = "#fff",
    backgroundColour: unknown = "#000",
    textAlign: unknown = "left",
): unknown => ({
    fontSize: fontSize,
    fontWeight: fontWeight,
    foregroundColour: foregroundColour,
    backgroundColour: backgroundColour,
    textAlign: textAlign,
});
