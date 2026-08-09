import { dotConfig } from "../dotConfig/DotConfig";
import type {
    DraftTextElement,
    Rect,
    TextElement,
    ToolType,
} from "../model/DotDocument";
import type { DotState, EditSession } from "../model/DotDocumentState";

import { initialState, initialStyle } from "./DotInitialState";
// -----------------------------------------------------------------------------

export type Action =
    | { type: "action/back" }
    | { type: "action/cancel" }
    | {
          type: "action/save";
          payload: {
              id: string;
              element: DraftTextElement;
          };
      }
    | {
          type: "change/draft/area";
          payload: Rect;
      }
    | {
          type: "change/element/area";
          payload: {
              id: string;
              area: Rect;
          };
      }
    | {
          type: "canvasMode/switch";
          payload: {
              toolType: ToolType | null;
              area: Rect | null;
          };
      }
    | {
          type: "element/edit";
          payload: string;
      }
    | {
          type: "element/select";
          payload: string;
      }
    | { type: "element/deselect" }
    | {
          type: "element/copy";
          payload: {
              id: string;
              newId: string;
          };
      }
    | { type: "element/delete"; payload: string }
    | {
          type: "change/draft/text";
          payload: string;
      }
    | {
          type: "relationship/parent/set";
          payload: {
              childId: string;
              parentId: string;
          };
      }
    | {
          type: "relationship/parent/unset";
          payload: string;
      };

function createSession(area: Rect): EditSession {
    return {
        editId: null,
        element: {
            toolType: "text",
            area,
            style: { ...initialStyle },
            text: "",
        },
    };
}

function getElementById(state: DotState, id: string) {
    const element = state.document.elements.find(
        (candidate) => candidate.id === id,
    );

    return element ?? null;
}

export function dotReducer(
    state: DotState = initialState,
    action: Action,
): DotState {
    switch (action.type) {
        // ---------------------------------------------------------------------
        // Action
        case "action/back": {
            if (state.canvasMode.mode === "editing") {
                return {
                    ...state,
                    toolType: null,
                    canvasMode: {
                        mode: "drawing",
                        session: state.canvasMode.session,
                    },
                };
            }

            return {
                ...state,
                toolType: null,
                canvasMode: {
                    mode: "idle",
                },
            };
        }

        case "action/cancel": {
            return {
                ...state,
                toolType: null,
                canvasMode: {
                    mode: "idle",
                },
            };
        }

        case "action/save": {
            if (state.canvasMode.mode !== "editing") return state;

            const area = action.payload.element.area;
            if (!area) return state;

            const editId = state.canvasMode.session.editId;
            const element: TextElement = {
                id: action.payload.id,
                toolType: action.payload.element.toolType,
                area,
                style: action.payload.element.style,
                text: action.payload.element.text,
            };

            return {
                ...state,
                toolType: null,
                canvasMode: {
                    mode: "idle",
                },
                document: {
                    ...state.document,
                    elements: editId
                        ? state.document.elements.map((existing) =>
                              existing.id === editId ? element : existing,
                          )
                        : [...state.document.elements, element],
                },
            };
        }

        // ---------------------------------------------------------------------
        // CanvasMode
        case "canvasMode/switch": {
            const { toolType, area } = action.payload;

            if (!area) {
                return {
                    ...state,
                    toolType,
                };
            }

            const session =
                state.canvasMode.mode === "idle"
                    ? createSession(area)
                    : {
                          ...state.canvasMode.session,
                          element: {
                              ...state.canvasMode.session.element,
                              area,
                          },
                      };

            return {
                ...state,
                toolType,
                canvasMode: toolType
                    ? {
                          mode: "editing",
                          session,
                      }
                    : {
                          mode: "drawing",
                          session,
                      },
            };
        }

        // ---------------------------------------------------------------------
        // Element
        case "element/edit": {
            const element = getElementById(state, action.payload);
            if (!element) return state;

            return {
                ...state,
                toolType: element.toolType,
                canvasMode: {
                    mode: "editing",
                    session: {
                        editId: element.id,
                        element: {
                            toolType: element.toolType,
                            area: { ...element.area },
                            style: { ...element.style },
                            text: element.text,
                        },
                    },
                },
            };
        }

        case "element/select": {
            const element = getElementById(state, action.payload);
            if (!element) return state;

            const selectedElementIds = new Set(state.selectedElementIds);

            if (selectedElementIds.has(element.id)) {
                selectedElementIds.delete(element.id);
            } else {
                selectedElementIds.add(element.id);
            }

            return {
                ...state,
                selectedElementIds,
            };
        }

        case "element/deselect": {
            if (state.selectedElementIds.size === 0) return state;

            return {
                ...state,
                selectedElementIds: new Set(),
            };
        }

        case "element/copy": {
            const element = getElementById(state, action.payload.id);
            if (!element) return state;

            const elementCopy: TextElement = {
                id: action.payload.newId,
                toolType: "text",
                area: {
                    left: element.area.left,
                    width: element.area.width,
                    top:
                        element.area.top +
                        element.area.height +
                        dotConfig.gridSpacing,
                    height: element.area.height,
                },
                style: element.style,
                text: element.text,
            };

            return {
                ...state,
                document: {
                    ...state.document,
                    elements: [...state.document.elements, elementCopy],
                },
            };
        }

        case "element/delete": {
            const elements = state.document.elements.filter(
                (el) => el.id !== action.payload,
            );
            const selectedElementIds = new Set(state.selectedElementIds);
            selectedElementIds.delete(action.payload);

            const isDeletingActiveEdit =
                state.canvasMode.mode !== "idle" &&
                state.canvasMode.session.editId === action.payload;

            return {
                ...state,
                selectedElementIds,
                toolType: isDeletingActiveEdit ? null : state.toolType,
                canvasMode: isDeletingActiveEdit
                    ? { mode: "idle" }
                    : state.canvasMode,
                document: {
                    ...state.document,
                    elements: elements,
                },
            };
        }

        // ---------------------------------------------------------------------
        // Change
        case "change/draft/text": {
            if (state.canvasMode.mode !== "editing") return state;

            return {
                ...state,
                canvasMode: {
                    ...state.canvasMode,
                    session: {
                        ...state.canvasMode.session,
                        element: {
                            ...state.canvasMode.session.element,
                            text: action.payload,
                        },
                    },
                },
            };
        }

        case "change/draft/area": {
            if (state.canvasMode.mode === "idle") return state;

            return {
                ...state,
                canvasMode: {
                    ...state.canvasMode,
                    session: {
                        ...state.canvasMode.session,
                        element: {
                            ...state.canvasMode.session.element,
                            area: action.payload,
                        },
                    },
                },
            };
        }

        case "change/element/area": {
            const changedElement = getElementById(state, action.payload.id);
            if (!changedElement) return state;

            const nextArea = action.payload.area;

            const deltaX = nextArea.left - changedElement.area.left;
            const deltaY = nextArea.top - changedElement.area.top;

            const isMove =
                nextArea.width === changedElement.area.width &&
                nextArea.height === changedElement.area.height;

            const shouldMoveSelection =
                state.selectedElementIds.has(changedElement.id) && isMove;

            return {
                ...state,
                document: {
                    ...state.document,
                    elements: state.document.elements.map((element) => {
                        if (element.id === changedElement.id) {
                            return {
                                ...element,
                                area: nextArea,
                            };
                        }

                        if (
                            shouldMoveSelection &&
                            state.selectedElementIds.has(element.id)
                        ) {
                            return {
                                ...element,
                                area: {
                                    ...element.area,
                                    left: element.area.left + deltaX,
                                    top: element.area.top + deltaY,
                                },
                            };
                        }

                        return element;
                    }),
                },
            };
        }

        // ---------------------------------------------------------------------
        // Relationship
        case "relationship/parent/set": {
            const { parentId, childId } = action.payload;

            if (parentId === childId) return state;

            const parentExists = state.document.elements.some(
                (element) => element.id === parentId,
            );
            const childExists = state.document.elements.some(
                (element) => element.id === childId,
            );

            if (!parentExists || !childExists) return state;

            return {
                ...state,
                document: {
                    ...state.document,
                    relationships: [
                        ...state.document.relationships.filter(
                            (relationship) => relationship.childId !== childId,
                        ),
                        {
                            type: "parent",
                            parentId,
                            childId,
                        },
                    ],
                },
            };
        }

        case "relationship/parent/unset": {
            const relationships = state.document.relationships.filter(
                (rel) => rel.childId !== action.payload,
            );

            return {
                ...state,
                document: {
                    ...state.document,
                    relationships: relationships,
                },
            };
        }

        // ---------------------------------------------------------------------
        // Default
        default:
            return state;
    }
}
