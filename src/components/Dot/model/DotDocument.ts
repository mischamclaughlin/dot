export type DotDocument = {
    schemaVersion: 1;
    elements: CanvasElement[];
};

export type CanvasElement = TextElement;

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
