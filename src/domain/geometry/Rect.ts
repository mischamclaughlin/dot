export type Rect = Readonly<{
    x: number;
    y: number;
    width: number;
    height: number;
}>;

export function isValidRect(rect: Rect): boolean {
    return (
        Number.isFinite(rect.x) &&
        Number.isFinite(rect.y) &&
        Number.isFinite(rect.width) &&
        Number.isFinite(rect.height) &&
        rect.width > 0 &&
        rect.height > 0
    );
}
