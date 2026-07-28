export type SquareDotDocument = {
    schemaVersion: 1;
    items: SquareDotItem[];
};

export type SquareDotItem = TextItem;

export type ToolType = "text";

export type TextItem = {
    id: string;
    toolType: "text";

    area: Rect;
    style: TextStyle;
    text: string;
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
