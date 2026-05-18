import type { CSSProperties } from "react";

export const dotGridTheme = {
    cellSize: 20,
    dotSize: 5,
} as const;

export const cssVars = {
    "--cell-size": `${dotGridTheme.cellSize}px`,
    "--dot-size": `${dotGridTheme.dotSize}px`,
} as CSSProperties;
