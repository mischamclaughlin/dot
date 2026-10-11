import { useCallback, type ReactElement } from "react";
import type { DocumentHistory } from "../../../application/history/DotDocumentHistory";
import type { Rect } from "../../../domain/geometry/Rect";
import type { EditorMode } from "../../../editor/stateMachine/EditorState";
import CanvasElement from "./components/CanvasElement";
import DragOverlay from "./components/DragTool";
import { rectStyle, textStyle } from "./shared/Style";

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
  const mapElement = useCallback(
    (id: string) => {
      const element = history.present.elements[id];
      if (!element) return null;

      const isEditingThis =
        mode.status === "editing-text" && mode.originalId === id;

      return {
        displayed: isEditingThis ? mode.draft : element,
        isActive: isActiveElement(id),
        isEditingThis,
        isBlocked: mode.status !== "idle" && !isEditingThis,
      };
    },
    [history.present.elements, mode, isActiveElement],
  );

  return (
    <main className={styles.canvas}>
      <section className={styles.savedElements} aria-label="Canvas elements">
        {history.present.rootIds.map((id) => {
          const mapped = mapElement(id);
          if (!mapped) return null;

          return (
            <article
              key={mapped.displayed.id}
              style={{
                ...rectStyle(mapped.displayed.rect),
                ...textStyle(mapped.displayed.style),
              }}
            >
              <CanvasElement
                isEditingThis={mapped.isEditingThis}
                element={mapped.displayed}
                onTextChange={onTextChange}
              />
              <div className={styles.selectLayer}>
                <div className={mapped.isActive ? styles.activeElement : ""} />
                <DragOverlay
                  isActive={mapped.isActive}
                  isBlocked={mapped.isBlocked}
                  isEditingThis={mapped.isEditingThis}
                  element={mapped.displayed}
                  onRectChange={onRectChange}
                  onSelectElement={onSelectElement}
                />
              </div>
            </article>
          );
        })}
        {mode.status === "creating-text" ? (
          <textarea
            value={mode.draft.text}
            onChange={(event) => onTextChange(event.target.value)}
            style={{
              ...rectStyle(mode.draft.rect),
              ...textStyle(mode.draft.style),
              resize: "none",
            }}
          />
        ) : null}
      </section>
    </main>
  );
}
