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

type CanvasProps = {
    isActiveElement: (id: string) => boolean;
    history: DocumentHistory;
    mode: EditorMode;
    onSelectElement: (id: string) => void;
    onTextChange: (event: string) => void;
    onRectChange: (rectUpdate: Rect) => void;
};

export default function Canvas({
    isActiveElement,
    history,
    mode,
    onSelectElement,
    onTextChange,
    onRectChange,
}: CanvasProps): ReactElement {
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

    function handlePointerMove(event: React.PointerEvent<HTMLButtonElement>) {
        const start = dragStart.current;
        if (!start || event.pointerId !== start.pointerId) return;

        const distanceX = event.clientX - start.x;
        const distanceY = event.clientY - start.y;

        setResizeRect({
            ...start.rect,
            width: Math.max(1, start.rect.width + distanceX),
            height: Math.max(1, start.rect.height + distanceY),
        });
    }

    function handlePointerEnd(event: React.PointerEvent<HTMLButtonElement>) {
        if (event.pointerId !== dragStart.current?.pointerId) return;

        dragStart.current = null;

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    }

    const displayedElement = (element: TextElement): TextElement => {
        return mode.status === "editing-text" && mode.originalId === element.id
            ? mode.draft
            : element;
    };

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

    return (
        <main className={styles.canvas}>
            <section
                className={styles.savedElements}
                aria-label="Saved elements"
            >
                {history.present.rootIds.map((id) => {
                    const element = history.present.elements[id];
                    if (!element) return null;

                    const displayed = displayedElement(element);

                    const isEditingThis =
                        mode.status === "editing-text" &&
                        mode.originalId === element.id;

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
                                    onChange={(event) =>
                                        onTextChange(event.target.value)
                                    }
                                    style={{
                                        ...textStyle(displayed.style),
                                        width: "100%",
                                        height: "100%",
                                        resize: "none",
                                    }}
                                />
                            ) : (
                                <>
                                    <p
                                        style={{
                                            ...textStyle(displayed.style),
                                            position: "absolute",
                                            whiteSpace: "pre-wrap",
                                        }}
                                    >
                                        {displayed.text}
                                    </p>
                                    <div
                                        className={`
                                            ${styles.selectLayer}
                                            ${
                                                isActiveElement(displayed.id)
                                                    ? styles.activeElement
                                                    : ""
                                            }
                                        `}
                                    >
                                        <button
                                            className={styles.selectButton}
                                            type="button"
                                            onClick={() =>
                                                onSelectElement(displayed.id)
                                            }
                                        />
                                        <ResizeBtn
                                            typeStyle="dragBar"
                                            sideStyle="dragTop"
                                            rect={displayed.rect}
                                            resize={{
                                                height:
                                                    displayed.rect.height + 10,
                                            }}
                                            onRectChange={onRectChange}
                                            onPointerDown={(event) =>
                                                handlePointerDown(
                                                    event,
                                                    displayed.rect,
                                                )
                                            }
                                            onPointermove={(event) =>
                                                handlePointerMove(event)
                                            }
                                            onPointerEnd={(event) =>
                                                handlePointerEnd(event)
                                            }
                                        />
                                        <ResizeBtn
                                            typeStyle="dragBar"
                                            sideStyle="dragBottom"
                                            rect={displayed.rect}
                                            resize={{ height: -10 }}
                                            onRectChange={onRectChange}
                                            onPointerDown={(event) =>
                                                handlePointerDown(
                                                    event,
                                                    displayed.rect,
                                                )
                                            }
                                            onPointermove={(event) =>
                                                handlePointerMove(event)
                                            }
                                            onPointerEnd={(event) =>
                                                handlePointerEnd(event)
                                            }
                                        />
                                        <ResizeBtn
                                            typeStyle="dragBar"
                                            sideStyle="dragRight"
                                            rect={displayed.rect}
                                            resize={{ width: 10 }}
                                            onRectChange={onRectChange}
                                            onPointerDown={(event) =>
                                                handlePointerDown(
                                                    event,
                                                    displayed.rect,
                                                )
                                            }
                                            onPointermove={(event) =>
                                                handlePointerMove(event)
                                            }
                                            onPointerEnd={(event) =>
                                                handlePointerEnd(event)
                                            }
                                        />
                                        <ResizeBtn
                                            typeStyle="dragBar"
                                            sideStyle="dragLeft"
                                            rect={displayed.rect}
                                            resize={{ width: -10 }}
                                            onRectChange={onRectChange}
                                            onPointerDown={(event) =>
                                                handlePointerDown(
                                                    event,
                                                    displayed.rect,
                                                )
                                            }
                                            onPointermove={(event) =>
                                                handlePointerMove(event)
                                            }
                                            onPointerEnd={(event) =>
                                                handlePointerEnd(event)
                                            }
                                        />
                                        <ResizeBtn
                                            typeStyle="dragCorner"
                                            sideStyle="dragTopLeft"
                                            rect={displayed.rect}
                                            resize={{
                                                height: -10,
                                                width: -10,
                                            }}
                                            onRectChange={onRectChange}
                                            onPointerDown={(event) =>
                                                handlePointerDown(
                                                    event,
                                                    displayed.rect,
                                                )
                                            }
                                            onPointermove={(event) =>
                                                handlePointerMove(event)
                                            }
                                            onPointerEnd={(event) =>
                                                handlePointerEnd(event)
                                            }
                                        />
                                        <ResizeBtn
                                            typeStyle="dragCorner"
                                            sideStyle="dragTopRight"
                                            rect={displayed.rect}
                                            resize={{
                                                height: -10,
                                                width: 10,
                                            }}
                                            onRectChange={onRectChange}
                                            onPointerDown={(event) =>
                                                handlePointerDown(
                                                    event,
                                                    displayed.rect,
                                                )
                                            }
                                            onPointermove={(event) =>
                                                handlePointerMove(event)
                                            }
                                            onPointerEnd={(event) =>
                                                handlePointerEnd(event)
                                            }
                                        />
                                        <ResizeBtn
                                            typeStyle="dragCorner"
                                            sideStyle="dragBottomLeft"
                                            rect={displayed.rect}
                                            resize={{
                                                height: 10,
                                                width: -10,
                                            }}
                                            onRectChange={onRectChange}
                                            onPointerDown={(event) =>
                                                handlePointerDown(
                                                    event,
                                                    displayed.rect,
                                                )
                                            }
                                            onPointermove={(event) =>
                                                handlePointerMove(event)
                                            }
                                            onPointerEnd={(event) =>
                                                handlePointerEnd(event)
                                            }
                                        />
                                        <ResizeBtn
                                            typeStyle="dragCorner"
                                            sideStyle="dragBottomRight"
                                            rect={displayed.rect}
                                            resize={{
                                                height:
                                                    displayed.rect.height + 10,
                                                width:
                                                    displayed.rect.width + 10,
                                            }}
                                            onRectChange={onRectChange}
                                            onPointerDown={(event) =>
                                                handlePointerDown(
                                                    event,
                                                    displayed.rect,
                                                )
                                            }
                                            onPointermove={(event) =>
                                                handlePointerMove(event)
                                            }
                                            onPointerEnd={(event) =>
                                                handlePointerEnd(event)
                                            }
                                        />
                                    </div>
                                </>
                            )}
                        </article>
                    );
                })}
                {mode.status === "creating-text" && (
                    <section
                        className={styles.creatingText}
                        aria-label="Saved elements"
                    >
                        <textarea
                            value={mode.draft.text}
                            onChange={(event) =>
                                onTextChange(event.target.value)
                            }
                            style={{
                                ...rectStyle(mode.draft.rect),
                                ...textStyle(mode.draft.style),
                                resize: "none",
                            }}
                        />
                    </section>
                )}
                {resizeRect !== null && (
                    <section
                        className={styles.creatingText}
                        aria-label="Saved elements"
                    >
                        <div
                            style={{
                                ...rectStyle(resizeRect),
                            }}
                        />
                    </section>
                )}
            </section>
        </main>
    );
}

type ResizeBtnProps = {
    typeStyle: "dragBar" | "dragCorner";
    sideStyle:
        | "dragTop"
        | "dragBottom"
        | "dragRight"
        | "dragLeft"
        | "dragTopLeft"
        | "dragTopRight"
        | "dragBottomLeft"
        | "dragBottomRight";
    rect: Rect;
    resize: Partial<Rect>;
    onRectChange: (rectUpdate: Rect) => void;
    onPointerDown: (
        event: React.PointerEvent<HTMLButtonElement>,
        rect: Rect,
    ) => void;
    onPointermove: (event: React.PointerEvent<HTMLButtonElement>) => void;
    onPointerEnd: (event: React.PointerEvent<HTMLButtonElement>) => void;
};

function ResizeBtn({
    typeStyle,
    sideStyle,
    rect,
    resize,
    onRectChange,
    onPointerDown,
    onPointermove,
    onPointerEnd,
}: ResizeBtnProps): ReactElement {
    return (
        <button
            className={`${styles[typeStyle]} ${styles[sideStyle]}`}
            aria-label={`Resize ${sideStyle.replace("drag", "")}`}
            type="button"
            onPointerDown={(event) => onPointerDown(event, rect)}
            onPointerMove={onPointermove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            onClick={() =>
                onRectChange({
                    ...rect,
                    ...resize,
                })
            }
        />
    );
}
