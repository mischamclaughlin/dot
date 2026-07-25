import type { ItemStyle } from "../../../../../types/DotGridTypes";

export function matchesStyle(
    itemStyle: ItemStyle,
    optionStyle: Partial<ItemStyle>,
): boolean {
    return Object.entries(optionStyle).every(
        ([property, value]) => itemStyle[property as keyof ItemStyle] === value,
    );
}
