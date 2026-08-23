import { hasOwnProperties, isRecord } from "../validation/isRecord";

export type Rect = Readonly<{
    x: number;
    y: number;
    width: number;
    height: number;
}>;

export function isRect(value: unknown): value is Rect {
    if (
        !isRecord(value) ||
        !hasOwnProperties(value, ["x", "y", "width", "height"])
    )
        return false;

    return (
        typeof value.x === "number" &&
        Number.isFinite(value.x) &&
        typeof value.y === "number" &&
        Number.isFinite(value.y) &&
        typeof value.width === "number" &&
        Number.isFinite(value.width) &&
        value.width > 0 &&
        typeof value.height === "number" &&
        Number.isFinite(value.height) &&
        value.height > 0
    );
}
