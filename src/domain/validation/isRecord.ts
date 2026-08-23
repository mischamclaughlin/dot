export function isRecord(value: unknown): value is Record<string, unknown> {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return false;
    }

    const prototype = Object.getPrototypeOf(value);

    return prototype === Object.prototype || prototype === null;
}

export function hasOwnProperties(
    value: Record<string, unknown>,
    propreties: readonly string[],
): boolean {
    return propreties.every((proprety) => Object.hasOwn(value, proprety));
}
