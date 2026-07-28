import type { TextStyle } from "../../../../../../../model/SquareDotDocument";

export function matchesStyle(
    itemStyle: TextStyle,
    optionStyle: Partial<TextStyle>,
): boolean {
    return Object.entries(optionStyle).every(
        ([property, value]) => itemStyle[property as keyof TextStyle] === value,
    );
}
