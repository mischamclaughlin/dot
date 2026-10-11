import { type CSSProperties, type ReactElement } from "react";

import { type DocumentHistory } from "../../../application/history/DotDocumentHistory";
import type {
  TextElement,
  TextStyle,
} from "../../../domain/elements/TextElement";
import { type EditorMode } from "../../../editor/stateMachine/EditorState";

import type { Rect } from "../../../domain/geometry/Rect";
import { DragTool } from "./components/DragTool";

import styles from "./Canvas.module.css";

type CanvasProps = {
  isActiveElement: (id: string) => boolean;
  history: DocumentHistory;
  mode: EditorMode;
  onRectChange: (elementId: string, rect: Rect) => void;
  onSelectElement: (id: string) => void;
  onTextChange: (event: string) => void;
};

export default function Canvas({
  isActiveElement,
  history,
  mode,
  onRectChange,
  onSelectElement,
  onTextChange,
}: CanvasProps): ReactElement {
  const textStyle = (style: TextStyle): CSSProperties => {
    return {
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      textAlign: style.textAlign,
      color: style.foregroundColour,
      backgroundColor: style.backgroundColour,
    };
  };

  const rectStyle = (rect: Rect): CSSProperties => {
    return {
      position: "absolute",
      left: rect.x,
      top: rect.y,
      width: rect.width,
      height: rect.height,
    };
  };

  const displayedElement = (element: TextElement): TextElement => {
    return mode.status === "editing-text" && mode.originalId === element.id
      ? mode.draft
      : element;
  };

  return (
    <main className={styles.canvas}>
      <section className={styles.savedElements} aria-label="Saved elements">
        {history.present.rootIds.map((id) => {
          const element = history.present.elements[id];
          if (!element) return null;

          const displayed = displayedElement(element);

          const isEditingThis =
            mode.status === "editing-text" && mode.originalId === element.id;

          const isBlocked = mode.status !== "idle" && !isEditingThis;

          return (
            <article
              key={element.id}
              style={{
                ...rectStyle(displayed.rect),
                ...textStyle(displayed.style),
              }}
            >
              {isEditingThis ? (
                <textarea
                  aria-label="Element text"
                  value={displayed.text}
                  onChange={(event) => onTextChange(event.target.value)}
                  style={{
                    ...textStyle(displayed.style),
                    width: "100%",
                    height: "100%",
                    resize: "none",
                  }}
                />
              ) : (
                <p
                  style={{
                    ...textStyle(displayed.style),
                    position: "absolute",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {displayed.text}
                </p>
              )}
              <div
                className={`${styles.selectLayer}
                            ${
                              isActiveElement(displayed.id)
                                ? styles.activeElement
                                : ""
                            }`}
              >
                <DragTool
                  isDisabled={isEditingThis || isBlocked}
                  element={displayed}
                  dragSide="dragRect"
                  onRectChange={onRectChange}
                  onSelectElement={onSelectElement}
                />
                <DragTool
                  isDisabled={isBlocked}
                  element={displayed}
                  dragSide="dragTop"
                  onRectChange={onRectChange}
                  onSelectElement={onSelectElement}
                />
                <DragTool
                  isDisabled={isBlocked}
                  element={displayed}
                  dragSide="dragBottom"
                  onRectChange={onRectChange}
                  onSelectElement={onSelectElement}
                />
                <DragTool
                  isDisabled={isBlocked}
                  element={displayed}
                  dragSide="dragRight"
                  onRectChange={onRectChange}
                  onSelectElement={onSelectElement}
                />
                <DragTool
                  isDisabled={isBlocked}
                  element={displayed}
                  dragSide="dragLeft"
                  onRectChange={onRectChange}
                  onSelectElement={onSelectElement}
                />
                <DragTool
                  isDisabled={isBlocked}
                  element={displayed}
                  dragSide="dragTopLeft"
                  onRectChange={onRectChange}
                  onSelectElement={onSelectElement}
                />
                <DragTool
                  isDisabled={isBlocked}
                  element={displayed}
                  dragSide="dragTopRight"
                  onRectChange={onRectChange}
                  onSelectElement={onSelectElement}
                />
                <DragTool
                  isDisabled={isBlocked}
                  element={displayed}
                  dragSide="dragBottomLeft"
                  onRectChange={onRectChange}
                  onSelectElement={onSelectElement}
                />
                <DragTool
                  isDisabled={isBlocked}
                  element={displayed}
                  dragSide="dragBottomRight"
                  onRectChange={onRectChange}
                  onSelectElement={onSelectElement}
                />
              </div>
            </article>
          );
        })}
        {mode.status === "creating-text" ? (
          <section className={styles.creatingText} aria-label="Saved elements">
            <textarea
              value={mode.draft.text}
              onChange={(event) => onTextChange(event.target.value)}
              style={{
                ...rectStyle(mode.draft.rect),
                ...textStyle(mode.draft.style),
                resize: "none",
              }}
            />
          </section>
        ) : null}
      </section>
    </main>
  );
}
