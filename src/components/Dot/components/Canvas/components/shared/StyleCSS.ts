import type { CSSProperties } from "react";

import type { TextStyle } from "../../../../model/DotDocument";
// -----------------------------------------------------------------------------

export function styleCSS(element: TextStyle) {
    return {
        alignContent: element.alignContent,
        textAlign: element.alignText,
        backgroundColor: element.colourBackground,
        color: element.colourForeground,
        fontSize: `${element.fontSize}rem`,
        fontWeight: element.fontWeight,
        paddingTop: `${element.paddingTop}px`,
        paddingRight: `${element.paddingRight}px`,
        paddingBottom: `${element.paddingBottom}px`,
        paddingLeft: `${element.paddingLeft}px`,
    } satisfies CSSProperties;
}
