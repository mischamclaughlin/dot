import type { ReactNode } from "react";
// -----------------------------------------------------------------------------

export type PaddingDirection = "down" | "up";
export type PaddingAxis = "height" | "width";

export type PaddingItem = {
    id: "top" | "bottom" | "left" | "right";
    label: "↥" | "↧" | "↦" | "↤";
    name: string;
    value: ReactNode;
    onChange: (direction: PaddingDirection) => void;
};

export type PaddingGroup = {
    name: string;
    items: PaddingItem[];
};

export type PaddingAxisGroup = PaddingGroup & {
    id: PaddingAxis;
};
