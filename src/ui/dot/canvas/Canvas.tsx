import React, {
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";

import { type DocumentHistory } from "../../../application/history/DotDocumentHistory";
import type {
  TextElement,
  TextStyle,
} from "../../../domain/elements/TextElement";
import { type EditorMode } from "../../../editor/stateMachine/EditorState";

import styles from "./Canvas.module.css";
import type { Rect } from "../../../domain/geometry/Rect";

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

type CanvasProps = {
  isActiveElement: (id: string) => boolean;
  history: DocumentHistory;
  mode: EditorMode;
  onEditStart: (id: string) => void;
  onRectChange: (rectUpdate: Rect) => void;
  onSelectElement: (id: string) => void;
  onTextChange: (event: string) => void;
};

export default function Canvas({
  isActiveElement,
  history,
  mode,
  onEditStart,
  onRectChange,
  onSelectElement,
  onTextChange,
}: CanvasProps): ReactElement {
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
                <ResizeBtn
                  element={displayed}
                  dragSide="dragRect"
                  dragType="dragButton"
                  onEditStart={() => onEditStart(displayed.id)}
                  onRectChange={onRectChange}
                  onSelectElement={onSelectElement}
                />
                <ResizeBtn
                  element={displayed}
                  dragSide="dragTop"
                  dragType="dragBar"
                  onEditStart={() => onEditStart(displayed.id)}
                  onRectChange={onRectChange}
                  onSelectElement={onSelectElement}
                />
                <ResizeBtn
                  element={displayed}
                  dragSide="dragBottom"
                  dragType="dragBar"
                  onEditStart={() => onEditStart(displayed.id)}
                  onRectChange={onRectChange}
                  onSelectElement={onSelectElement}
                />
                <ResizeBtn
                  element={displayed}
                  dragSide="dragRight"
                  dragType="dragBar"
                  onEditStart={() => onEditStart(displayed.id)}
                  onRectChange={onRectChange}
                  onSelectElement={onSelectElement}
                />
                <ResizeBtn
                  element={displayed}
                  dragSide="dragLeft"
                  dragType="dragBar"
                  onEditStart={() => onEditStart(displayed.id)}
                  onRectChange={onRectChange}
                  onSelectElement={onSelectElement}
                />
                <ResizeBtn
                  element={displayed}
                  dragSide="dragTopLeft"
                  dragType="dragCorner"
                  onEditStart={() => onEditStart(displayed.id)}
                  onRectChange={onRectChange}
                  onSelectElement={onSelectElement}
                />
                <ResizeBtn
                  element={displayed}
                  dragSide="dragTopRight"
                  dragType="dragCorner"
                  onEditStart={() => onEditStart(displayed.id)}
                  onRectChange={onRectChange}
                  onSelectElement={onSelectElement}
                />
                <ResizeBtn
                  element={displayed}
                  dragSide="dragBottomLeft"
                  dragType="dragCorner"
                  onEditStart={() => onEditStart(displayed.id)}
                  onRectChange={onRectChange}
                  onSelectElement={onSelectElement}
                />
                <ResizeBtn
                  element={displayed}
                  dragSide="dragBottomRight"
                  dragType="dragCorner"
                  onEditStart={() => onEditStart(displayed.id)}
                  onRectChange={onRectChange}
                  onSelectElement={onSelectElement}
                />
              </div>
            </article>
          );
        })}
        {mode.status === "creating-text" && (
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
        )}
      </section>
    </main>
  );
}

type DragSide =
  | "dragRect"
  | "dragTop"
  | "dragBottom"
  | "dragRight"
  | "dragLeft"
  | "dragTopLeft"
  | "dragTopRight"
  | "dragBottomLeft"
  | "dragBottomRight";

type ResizeBtnProps = {
  element: TextElement;
  dragSide: DragSide;
  dragType: "dragButton" | "dragBar" | "dragCorner";
  onEditStart: (id: string) => void;
  onRectChange: (rectUpdate: Rect) => void;
  onSelectElement: (id: string) => void;
};

function ResizeBtn({
  element,
  dragSide,
  dragType,
  onEditStart,
  onRectChange,
  onSelectElement,
}: ResizeBtnProps): ReactElement {
  const [resizeRect, setResizeRect] = useState<Rect | null>(null);
  const dragStart = useRef<{
    pointerId: number;
    x: number;
    y: number;
    rect: Rect;
  } | null>(null);

  function handlePointerDown(
    event: React.PointerEvent<HTMLButtonElement>,
    rect: Rect,
  ) {
    if (event.button !== 0) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    dragStart.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      rect: { ...rect },
    };
  }

  function handlePointerMove(
    event: React.PointerEvent<HTMLButtonElement>,
    dragSide: DragSide,
  ) {
    const start = dragStart.current;
    if (!start || event.pointerId !== start.pointerId) return;

    onEditStart(element.id);

    if (dragSide === "dragRect") {
      setResizeRect({
        ...start.rect,
        x: start.rect.x + event.clientX - start.x,
        y: start.rect.y + event.clientY - start.y,
      });

      return;
    }

    const movesLeft =
      dragSide === "dragLeft" ||
      dragSide === "dragTopLeft" ||
      dragSide === "dragBottomLeft";
    const movesRight =
      dragSide === "dragRight" ||
      dragSide === "dragTopRight" ||
      dragSide === "dragBottomRight";
    const movesTop =
      dragSide === "dragTop" ||
      dragSide === "dragTopLeft" ||
      dragSide === "dragTopRight";
    const movesBottom =
      dragSide === "dragBottom" ||
      dragSide === "dragBottomLeft" ||
      dragSide === "dragBottomRight";

    const distanceX = movesLeft || movesRight ? event.clientX - start.x : 0;
    const distanceY = movesTop || movesBottom ? event.clientY - start.y : 0;

    const width = start.rect.width + (movesLeft ? -distanceX : distanceX);
    const height = start.rect.height + (movesTop ? -distanceY : distanceY);

    setResizeRect({
      ...start.rect,
      x: movesLeft
        ? start.rect.x + Math.min(distanceX, start.rect.width)
        : start.rect.x + Math.min(0, width),
      y: movesTop
        ? start.rect.y + Math.min(distanceY, start.rect.height)
        : start.rect.y + Math.min(0, height),
      width: Math.abs(width),
      height: Math.abs(height),
    });
  }

  function handlePointerEnd(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.pointerId !== dragStart.current?.pointerId) return;

    dragStart.current = null;

    if (resizeRect !== null && event.type === "pointerup") {
      onRectChange({ ...resizeRect });
    }
    setResizeRect(null);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <>
      <button
        className={`${styles[dragType]} ${styles[dragSide]}`}
        aria-label={`Resize ${dragSide.replace("drag", "")}`}
        type="button"
        onPointerDown={(event) => handlePointerDown(event, element.rect)}
        onPointerMove={(event) => handlePointerMove(event, dragSide)}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onClick={() => onSelectElement(element.id)}
      />
      {resizeRect !== null ? (
        <div
          className={styles.tempResizeArea}
          style={{
            left: resizeRect.x - element.rect.x,
            top: resizeRect.y - element.rect.y,
            width: resizeRect.width,
            height: resizeRect.height,
          }}
        />
      ) : null}
    </>
  );
}
