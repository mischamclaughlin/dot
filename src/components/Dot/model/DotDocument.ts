export type DotDocument = {
    schemaVersion: 2;
    elements: CanvasElement[];
    relationships: ParentRelationship[];
};

export type BaseCanvasElement = TextElement;
export type CanvasElement = BaseCanvasElement;

export type DraftTextElement = {
    toolType: "text";
    area: Rect | null;
    style: TextStyle;
    text: string;
};

export type TextElement = {
    id: string;
    toolType: "text";
    area: Rect;
    style: TextStyle;
    text: string;
    childInheritance: InheritancePolicy;
};

export type Rect = {
    left: number;
    width: number;
    top: number;
    height: number;
};

export type TextStyle = {
    alignContent: "start" | "center" | "end";
    alignText: "left" | "center" | "right" | "justify";
    colourBackground: string;
    colourForeground: string;
    fontSize: number;
    fontWeight: number;
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;
};

export type ToolType = "text";

export const inheritableGeometryAttributes = ["width", "height"] as const;

export const inheritableStyleAttributes = [
    "alignContent",
    "alignText",
    "colourBackground",
    "colourForeground",
    "fontSize",
    "fontWeight",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
] as const satisfies readonly (keyof TextStyle)[];

export type InheritableGeometryAttribute =
    (typeof inheritableGeometryAttributes)[number];

export type InheritableStyleAttribute =
    (typeof inheritableStyleAttributes)[number];

export type InheritancePolicy = {
    geometry: readonly InheritableGeometryAttribute[];
    style: readonly InheritableStyleAttribute[];
};

export function createDefaultInheritancePolicy(): InheritancePolicy {
    return {
        geometry: [...inheritableGeometryAttributes],
        style: [...inheritableStyleAttributes],
    };
}

export type ParentRelationship = {
    type: "parent";
    parentId: string;
    childId: string;
};
