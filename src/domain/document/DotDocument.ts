import type { CanvasElement } from "../elements/CanvasElement";

export type DotDocument = Readonly<{
    schemaVersion: 1;
    rootIds: readonly string[];
    elements: Readonly<Record<string, CanvasElement>>;
}>;

export function createEmptyDocument(): DotDocument {
    return {
        schemaVersion: 1,
        rootIds: [],
        elements: {},
    };
}
