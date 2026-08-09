import { dotConfig } from "../dotConfig/DotConfig";
import type {
    DraftTextElement,
    InheritableGeometryAttribute,
    InheritableStyleAttribute,
    Rect,
    TextElement,
    ToolType,
} from "../model/DotDocument";
import { createDefaultInheritancePolicy } from "../model/DotDocument";
import type { DotState, EditSession } from "../model/DotDocumentState";
import {
    getInheritedAttributes,
    resolveElement,
    wouldCreateParentCycle,
} from "../services/DotInheritanceService";

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
      }
    | {
          type: "inheritance/attribute/set";
          payload:
              | {
                    parentId: string;
                    group: "geometry";
                    attribute: InheritableGeometryAttribute;
                    enabled: boolean;
                }
              | {
                    parentId: string;
                    group: "style";
                    attribute: InheritableStyleAttribute;
                    enabled: boolean;
                };
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

function setAttribute<T extends string>(
    attributes: readonly T[],
    attribute: T,
    enabled: boolean,
): readonly T[] {
    if (enabled) {
        return attributes.includes(attribute)
            ? attributes
            : [...attributes, attribute];
    }

    return attributes.filter((candidate) => candidate !== attribute);
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
            const existingElement = editId
                ? getElementById(state, editId)
                : null;

            const nextArea = { ...area };
            const nextStyle = { ...action.payload.element.style };

            if (existingElement) {
                const inheritedAttributes = getInheritedAttributes(
                    state.document,
                    existingElement.id,
                );

                for (const attribute of inheritedAttributes.geometry) {
                    Object.assign(nextArea, {
                        [attribute]: existingElement.area[attribute],
                    });
                }

                for (const attribute of inheritedAttributes.style) {
                    Object.assign(nextStyle, {
                        [attribute]: existingElement.style[attribute],
                    });
                }
            }

            const element: TextElement = {
                id: action.payload.id,
                toolType: action.payload.element.toolType,
                area: nextArea,
                style: nextStyle,
                text: action.payload.element.text,
                childInheritance: existingElement
                    ? {
                          geometry: [
                              ...existingElement.childInheritance.geometry,
                          ],
                          style: [...existingElement.childInheritance.style],
                      }
                    : createDefaultInheritancePolicy(),
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
            const element = resolveElement(state.document, action.payload);
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
            const element = resolveElement(state.document, action.payload.id);
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
                style: { ...element.style },
                text: element.text,
                childInheritance: {
                    geometry: [...element.childInheritance.geometry],
                    style: [...element.childInheritance.style],
                },
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
            const directChildIds = new Set(
                state.document.relationships
                    .filter(
                        (relationship) =>
                            relationship.parentId === action.payload,
                    )
                    .map((relationship) => relationship.childId),
            );

            const elements = state.document.elements
                .map((element) => {
                    if (!directChildIds.has(element.id)) return element;

                    const resolvedElement = resolveElement(
                        state.document,
                        element.id,
                    );

                    return resolvedElement
                        ? {
                              ...element,
                              area: { ...resolvedElement.area },
                              style: { ...resolvedElement.style },
                          }
                        : element;
                })
                .filter((element) => element.id !== action.payload);
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
                    relationships: state.document.relationships.filter(
                        (relationship) =>
                            relationship.parentId !== action.payload &&
                            relationship.childId !== action.payload,
                    ),
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

            const nextArea = { ...action.payload };
            const editId = state.canvasMode.session.editId;

            if (editId) {
                const inheritedAttributes = getInheritedAttributes(
                    state.document,
                    editId,
                );

                for (const attribute of inheritedAttributes.geometry) {
                    const currentArea = state.canvasMode.session.element.area;
                    if (!currentArea) continue;

                    Object.assign(nextArea, {
                        [attribute]: currentArea[attribute],
                    });
                }
            }

            return {
                ...state,
                canvasMode: {
                    ...state.canvasMode,
                    session: {
                        ...state.canvasMode.session,
                        element: {
                            ...state.canvasMode.session.element,
                            area: nextArea,
                        },
                    },
                },
            };
        }

        case "change/element/area": {
            const changedElement = getElementById(state, action.payload.id);
            if (!changedElement) return state;

            const resolvedChangedElement = resolveElement(
                state.document,
                changedElement.id,
            );
            if (!resolvedChangedElement) return state;

            const nextArea = action.payload.area;

            const deltaX = nextArea.left - resolvedChangedElement.area.left;
            const deltaY = nextArea.top - resolvedChangedElement.area.top;

            const isMove =
                nextArea.width === resolvedChangedElement.area.width &&
                nextArea.height === resolvedChangedElement.area.height;

            const shouldMoveSelection =
                state.selectedElementIds.has(changedElement.id) && isMove;

            const changedElementArea = { ...nextArea };
            const inheritedAttributes = getInheritedAttributes(
                state.document,
                changedElement.id,
            );

            for (const attribute of inheritedAttributes.geometry) {
                Object.assign(changedElementArea, {
                    [attribute]: changedElement.area[attribute],
                });
            }

            return {
                ...state,
                document: {
                    ...state.document,
                    elements: state.document.elements.map((element) => {
                        if (element.id === changedElement.id) {
                            return {
                                ...element,
                                area: changedElementArea,
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

            if (
                !parentExists ||
                !childExists ||
                wouldCreateParentCycle(state.document, parentId, childId)
            ) {
                return state;
            }

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
            const relationshipExists = state.document.relationships.some(
                (relationship) => relationship.childId === action.payload,
            );
            if (!relationshipExists) return state;

            const resolvedElement = resolveElement(
                state.document,
                action.payload,
            );
            const relationships = state.document.relationships.filter(
                (rel) => rel.childId !== action.payload,
            );

            return {
                ...state,
                document: {
                    ...state.document,
                    elements: resolvedElement
                        ? state.document.elements.map((element) =>
                              element.id === action.payload
                                  ? {
                                        ...element,
                                        area: { ...resolvedElement.area },
                                        style: { ...resolvedElement.style },
                                    }
                                  : element,
                          )
                        : state.document.elements,
                    relationships: relationships,
                },
            };
        }

        // ---------------------------------------------------------------------
        // Inheritance
        case "inheritance/attribute/set": {
            const { parentId, enabled } = action.payload;
            const parent = getElementById(state, parentId);
            if (!parent) return state;

            const isEnabled =
                action.payload.group === "geometry"
                    ? parent.childInheritance.geometry.includes(
                          action.payload.attribute,
                      )
                    : parent.childInheritance.style.includes(
                          action.payload.attribute,
                      );
            if (isEnabled === enabled) return state;

            const directChildIds = new Set(
                state.document.relationships
                    .filter(
                        (relationship) => relationship.parentId === parentId,
                    )
                    .map((relationship) => relationship.childId),
            );

            const resolvedChildren = new Map(
                state.document.elements
                    .filter((element) => directChildIds.has(element.id))
                    .map((element) => [
                        element.id,
                        resolveElement(state.document, element.id),
                    ]),
            );

            const elementsWithMaterialisedAttribute = enabled
                ? state.document.elements
                : state.document.elements.map((element) => {
                      const resolvedElement = resolvedChildren.get(element.id);
                      if (!resolvedElement) return element;

                      if (action.payload.group === "geometry") {
                          return {
                              ...element,
                              area: {
                                  ...element.area,
                                  [action.payload.attribute]:
                                      resolvedElement.area[
                                          action.payload.attribute
                                      ],
                              },
                          };
                      }

                      return {
                          ...element,
                          style: {
                              ...element.style,
                              [action.payload.attribute]:
                                  resolvedElement.style[
                                      action.payload.attribute
                                  ],
                          },
                      };
                  });

            return {
                ...state,
                document: {
                    ...state.document,
                    elements: elementsWithMaterialisedAttribute.map(
                        (element) => {
                            if (element.id !== parentId) return element;

                            if (action.payload.group === "geometry") {
                                return {
                                    ...element,
                                    childInheritance: {
                                        ...element.childInheritance,
                                        geometry: setAttribute(
                                            element.childInheritance.geometry,
                                            action.payload.attribute,
                                            enabled,
                                        ),
                                    },
                                };
                            }

                            return {
                                ...element,
                                childInheritance: {
                                    ...element.childInheritance,
                                    style: setAttribute(
                                        element.childInheritance.style,
                                        action.payload.attribute,
                                        enabled,
                                    ),
                                },
                            };
                        },
                    ),
                },
            };
        }

        // ---------------------------------------------------------------------
        // Default
        default:
            return state;
    }
}
