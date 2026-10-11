import { useRef, useState, type ReactElement } from "react";
import type { TextElement } from "../../../../../domain/elements/TextElement";
import type { Rect } from "../../../../../domain/geometry/Rect";

import styles from "./DragControls.module.css";

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

type DragControlsProps = {
  isDisabled: boolean;
  element: TextElement;
  dragSide: DragSide;
  onRectChange: (elementId: string, rect: Rect) => void;
  onSelectElement: (id: string) => void;
};

export function DragControls({
  isDisabled,
  element,
  dragSide,
  onRectChange,
  onSelectElement,
}: DragControlsProps): ReactElement {
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

    onSelectElement(element.id);

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
      onRectChange(element.id, resizeRect);
    }
    setResizeRect(null);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <>
      <button
        className={`${styles.dragArea} ${styles[dragSide]}`}
        aria-label={`Resize ${dragSide.replace("drag", "")}`}
        disabled={isDisabled}
        style={{ pointerEvents: isDisabled ? "none" : "auto" }}
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
