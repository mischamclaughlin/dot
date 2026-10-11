import { useReducer, useState, type ReactElement } from "react";

import { createHistory } from "../application/history/DotDocumentHistory";
import { createEmptyDocument } from "../domain/document/DotDocument";
import { isRect, type Rect } from "../domain/geometry/Rect";
import {
  createEditorState,
  reduceEditorState,
} from "../editor/stateMachine/EditorState";
import Canvas from "./dot/canvas/Canvas";
import Sidebar from "./dot/sidebar/Sidebar";

export default function Dot(): ReactElement {
  const [state, dispatch] = useReducer(reduceEditorState, undefined, () =>
    createEditorState(createHistory(createEmptyDocument())),
  );

  const { history, mode } = state;
  const isEditing = state.mode.status !== "idle";
  const draft = mode.status === "idle" ? null : mode.draft;

  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);

  const isActiveElement = (incomingId: string) => {
    return selectedElementIds.includes(incomingId);
  };

  const isEditPossible: boolean = selectedElementIds.length > 0;

  const handleEditStart = (elementId?: string) => {
    const id = elementId ?? selectedElementIds[0];
    if (id === undefined) return;

    setSelectedElementIds((curr) => (curr.includes(id) ? curr : [...curr, id]));

    dispatch({ type: "editStarted", originalId: id });
  };

  const handleElementRectChange = (elementId: string, rect: Rect) => {
    if (!isRect(rect)) return;

    if (mode.status === "editing-text" && mode.originalId === elementId) {
      dispatch({ type: "draftRectChanged", rect });
    } else {
      dispatch({ type: "elementRectChanged", elementId, rect });
    }
  };

  const handleSave = () => {
    return dispatch({ type: "draftSaved" });
  };

  const handleCancel = () => {
    return dispatch({ type: "draftCancelled" });
  };

  const handleUndo = () => {
    return dispatch({ type: "undo" });
  };

  const handleRedo = () => {
    return dispatch({ type: "redo" });
  };

  const handleRectChange = (rectUpdate: Rect) => {
    if (!draft || !isRect(rectUpdate)) return;

    return dispatch({
      type: "draftRectChanged",
      rect: rectUpdate,
    });
  };

  const handleAddText = () => {
    return dispatch({
      type: "createStarted",
      element: {
        kind: "text",
        id: crypto.randomUUID(),
        text: "",
        rect: { x: 200, y: 200, width: 500, height: 500 },
        style: {
          backgroundColour: "#ffffff",
          foregroundColour: "#222222",
          fontSize: 16,
          fontWeight: 400,
          textAlign: "left",
        },
      },
    });
  };

  const handleTextChange = (text: string) => {
    return dispatch({
      type: "draftTextChanged",
      text: text,
    });
  };

  const handleSelectElement = (incomingId: string) => {
    setSelectedElementIds((curr) =>
      curr.includes(incomingId)
        ? curr.filter((id) => id !== incomingId)
        : [...curr, incomingId],
    );
  };

  return (
    <>
      <Sidebar
        isEditing={isEditing}
        isEditPossible={isEditPossible}
        draft={draft}
        onAddText={handleAddText}
        onCancel={handleCancel}
        onEditStart={() => handleEditStart()}
        onRectChange={handleRectChange}
        onRedo={handleRedo}
        onSave={handleSave}
        onUndo={handleUndo}
      />

      <Canvas
        isActiveElement={isActiveElement}
        history={history}
        mode={state.mode}
        onRectChange={handleElementRectChange}
        onSelectElement={handleSelectElement}
        onTextChange={handleTextChange}
      />

      {state.lastError && <p role="alert">{state.lastError}</p>}
    </>
  );
}
