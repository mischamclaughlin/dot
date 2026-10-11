import {
  commitTextElementDraft,
  type CommitTextElementDraftError,
} from "../../application/commands/element/textElement/commitDraft";
import { updateArea } from "../../application/commands/element/updateArea";
import {
  commitHistory,
  redoHistory,
  undoHistory,
  type DocumentHistory,
} from "../../application/history/DotDocumentHistory";
import { getElementById } from "../../domain/document/DotDocument";
import {
  cloneTextElement,
  type TextElement,
  type TextStyle,
} from "../../domain/elements/TextElement";
import type { Rect } from "../../domain/geometry/Rect";

export type EditorMode =
  | Readonly<{ status: "idle" }>
  | Readonly<{ status: "creating-text"; draft: TextElement }>
  | Readonly<{
      status: "editing-text";
      originalId: string;
      draft: TextElement;
    }>;

export type EditorState = Readonly<{
  history: DocumentHistory;
  mode: EditorMode;
  lastError?: CommitTextElementDraftError;
}>;

export type EditorEvent =
  | Readonly<{ type: "createStarted"; element: TextElement }>
  | Readonly<{
      type: "editStarted";
      originalId: string;
    }>
  | Readonly<{ type: "draftTextChanged"; text: string }>
  | Readonly<{ type: "draftStyleChanged"; style: TextStyle }>
  | Readonly<{ type: "draftRectChanged"; rect: Rect }>
  | Readonly<{ type: "draftSaved" }>
  | Readonly<{ type: "draftCancelled" }>
  | Readonly<{ type: "undo" }>
  | Readonly<{ type: "redo" }>
  | Readonly<{ type: "elementRectChanged"; elementId: string; rect: Rect }>;

export function createEditorState(history: DocumentHistory): EditorState {
  return { history, mode: { status: "idle" } };
}

export function reduceEditorState(
  state: EditorState,
  event: EditorEvent,
): EditorState {
  switch (event.type) {
    case "createStarted":
      return startCreateDraft(state, event.element);

    case "editStarted":
      return startEditDraft(state, event.originalId);

    case "draftTextChanged":
      return updateDraft(state, (draft) => ({
        ...draft,
        text: event.text,
      }));

    case "draftStyleChanged":
      return updateDraft(state, (draft) => ({
        ...draft,
        style: { ...event.style },
      }));

    case "draftRectChanged":
      return updateDraft(state, (draft) => ({
        ...draft,
        rect: { ...event.rect },
      }));

    case "draftSaved":
      return saveDraft(state);

    case "draftCancelled":
      return state.mode.status === "idle"
        ? state
        : { ...state, mode: { status: "idle" }, lastError: undefined };

    case "undo":
      return state.mode.status === "idle"
        ? { ...state, history: undoHistory(state.history) }
        : state;

    case "redo":
      return state.mode.status === "idle"
        ? { ...state, history: redoHistory(state.history) }
        : state;

    case "elementRectChanged": {
      const result = updateArea(
        state.history.present,
        event.elementId,
        event.rect,
      );

      if (!result.ok) {
        return { ...state, lastError: result.error };
      }

      return {
        ...state,
        history: commitHistory(state.history, result.document),
        lastError: undefined,
      };
    }
  }
}

function startCreateDraft(
  state: EditorState,
  element: TextElement,
): EditorState {
  return state.mode.status === "idle"
    ? {
        ...state,
        mode: {
          status: "creating-text",
          draft: cloneTextElement(element),
        },
        lastError: undefined,
      }
    : state;
}

function startEditDraft(state: EditorState, elementId: string): EditorState {
  if (state.mode.status !== "idle") {
    return state;
  }

  const element = getElementById(state.history.present, elementId);

  if (!element) {
    return {
      ...state,
      lastError: "invalid-id",
    };
  }

  return {
    ...state,
    mode: {
      status: "editing-text",
      originalId: element.id,
      draft: cloneTextElement(element),
    },
    lastError: undefined,
  };
}

function updateDraft(
  state: EditorState,
  update: (draft: TextElement) => TextElement,
): EditorState {
  if (state.mode.status === "idle") {
    return state;
  }

  return {
    ...state,
    mode: { ...state.mode, draft: update(state.mode.draft) },
  };
}

function saveDraft(state: EditorState): EditorState {
  if (state.mode.status === "idle") {
    return state;
  }

  const draft =
    state.mode.status === "creating-text"
      ? { mode: "create" as const, element: state.mode.draft }
      : {
          mode: "edit" as const,
          originalId: state.mode.originalId,
          element: state.mode.draft,
        };

  const result = commitTextElementDraft(state.history.present, draft);

  if (!result.ok) {
    return { ...state, lastError: result.error };
  }

  return {
    history: commitHistory(state.history, result.document),
    mode: { status: "idle" },
    lastError: undefined,
  };
}
