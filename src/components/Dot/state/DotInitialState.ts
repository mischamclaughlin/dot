import type { TextStyle } from "../model/DotDocument";
import type { DotState } from "../model/DotDocumentState";

export const initialState: DotState = {
    document: {
        schemaVersion: 1,
        elements: [],
    },
    selectedElementIds: new Set(),
    toolType: null,
    canvasMode: {
        mode: "idle",
    },
};

export const initialStyle: TextStyle = {
    alignContent: "center",
    alignText: "left",
    colourBackground: "#faf4ed",
    colourForeground: "#464261",
    fontSize: 1,
    fontWeight: 300,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 4,
    paddingLeft: 4,
};
