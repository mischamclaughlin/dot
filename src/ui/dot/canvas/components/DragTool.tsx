import type { ReactElement } from "react";
import type { TextElement } from "../../../../domain/elements/TextElement";
import type { Rect } from "../../../../domain/geometry/Rect";
import { DragControls } from "./DragTool/DragControls";

type DragToolProps = {
  isActive: boolean;
  isBlocked: boolean;
  isEditingThis: boolean;
  element: TextElement;
  onRectChange: (elementId: string, rect: Rect) => void;
  onSelectElement: (id: string) => void;
};

export default function DragTool({
  isBlocked,
  isEditingThis,
  element,
  onRectChange,
  onSelectElement,
}: DragToolProps): ReactElement {
  return (
    <>
      <DragControls
        isDisabled={isEditingThis || isBlocked}
        element={element}
        dragSide="dragRect"
        onRectChange={onRectChange}
        onSelectElement={onSelectElement}
      />
      <DragControls
        isDisabled={isBlocked}
        element={element}
        dragSide="dragTop"
        onRectChange={onRectChange}
        onSelectElement={onSelectElement}
      />
      <DragControls
        isDisabled={isBlocked}
        element={element}
        dragSide="dragBottom"
        onRectChange={onRectChange}
        onSelectElement={onSelectElement}
      />
      <DragControls
        isDisabled={isBlocked}
        element={element}
        dragSide="dragRight"
        onRectChange={onRectChange}
        onSelectElement={onSelectElement}
      />
      <DragControls
        isDisabled={isBlocked}
        element={element}
        dragSide="dragLeft"
        onRectChange={onRectChange}
        onSelectElement={onSelectElement}
      />
      <DragControls
        isDisabled={isBlocked}
        element={element}
        dragSide="dragTopLeft"
        onRectChange={onRectChange}
        onSelectElement={onSelectElement}
      />
      <DragControls
        isDisabled={isBlocked}
        element={element}
        dragSide="dragTopRight"
        onRectChange={onRectChange}
        onSelectElement={onSelectElement}
      />
      <DragControls
        isDisabled={isBlocked}
        element={element}
        dragSide="dragBottomLeft"
        onRectChange={onRectChange}
        onSelectElement={onSelectElement}
      />
      <DragControls
        isDisabled={isBlocked}
        element={element}
        dragSide="dragBottomRight"
        onRectChange={onRectChange}
        onSelectElement={onSelectElement}
      />
    </>
  );
}
