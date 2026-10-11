import type { ReactElement } from "react";
import type { TextElement } from "../../../../domain/elements/TextElement";
import { textStyle } from "../shared/Style";

type ElementProps = {
  isEditingThis: boolean;
  element: TextElement;
  onTextChange: (event: string) => void;
};

export default function CanvasElement({
  isEditingThis,
  element,
  onTextChange,
}: ElementProps): ReactElement {
  return (
    <>
      {isEditingThis ? (
        <textarea
          aria-label="Element text"
          value={element.text}
          onChange={(event) => onTextChange(event.target.value)}
          style={{
            ...textStyle(element.style),
            width: "100%",
            height: "100%",
            resize: "none",
          }}
        />
      ) : (
        <p
          style={{
            ...textStyle(element.style),
            position: "absolute",
            whiteSpace: "pre-wrap",
          }}
        >
          {element.text}
        </p>
      )}
    </>
  );
}
