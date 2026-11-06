import { useState, type ReactElement } from "react";

import type { TextElement } from "../../../domain/elements/TextElement";
import type { Rect } from "../../../domain/geometry/Rect";

import {
    TbArrowBack,
    TbArrowForward,
    TbArrowAutofitDown,
    TbArrowAutofitUp,
    TbArrowAutofitLeft,
    TbArrowAutofitRight,
    TbCubePlus,
    TbEdit,
} from "react-icons/tb";

import { TbArrowMoveDown } from "react-icons/tb";
import { TbArrowMoveUp } from "react-icons/tb";
import { TbArrowMoveLeft } from "react-icons/tb";
import { TbArrowMoveRight } from "react-icons/tb";

import styles from "./Sidebar.module.css";

const ICON_SIZE = 24;
const ICON_STROKE = 1;

type SidebarProps = {
    isEditing: boolean;
    isEditPossible: boolean;
    canEditHistory: { canUndo: boolean; canRedo: boolean };
    draft: TextElement | null;
    onAddText: () => void;
    onCancel: () => void;
    onEditStart: () => void;
    onRectChange: (rectUpdate: Rect) => void;
    onRedo: () => void;
    onSave: () => void;
    onUndo: () => void;
};

export default function Sidebar({
    isEditing,
    isEditPossible,
    canEditHistory,
    draft,
    onAddText,
    onCancel,
    onEditStart,
    onRectChange,
    onRedo,
    onSave,
    onUndo,
}: SidebarProps): ReactElement {
    const [widthControl, setWdithControl] = useState<{
        isDragging: boolean;
        width: number;
    }>({ isDragging: false, width: 100 });

    const isEditingPossible = !isEditPossible || isEditing;

    function handlePointerDown(event: React.PointerEvent<HTMLButtonElement>) {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);

        setWdithControl({ isDragging: true, width: event.clientX });
    }

    function handlePointerMove(event: React.PointerEvent<HTMLButtonElement>) {
        event.preventDefault();
        if (!widthControl.isDragging) return;

        event.currentTarget.setPointerCapture(event.pointerId);

        setWdithControl({ isDragging: true, width: event.clientX });
    }

    function handlePointerEnd(event: React.PointerEvent<HTMLButtonElement>) {
        event.preventDefault();
        setWdithControl({
            isDragging: false,
            width: widthControl.width,
        });
    }

    return (
        <div
            className={styles.sidebar}
            style={{
                width: `${widthControl.width}px`,
            }}
        >
            <form
                className={styles.sidebarLayout}
                style={{ display: "flex", flexDirection: "column" }}
                onSubmit={(event) => {
                    event.preventDefault();
                    onSave();
                }}
            >
                <nav
                    className={styles.controlsLayout}
                    aria-label="Editor actions"
                >
                    <div className={styles.rowLayout}>
                        <button
                            className={styles.button}
                            onClick={onAddText}
                            disabled={isEditing}
                        >
                            <TbCubePlus
                                size={ICON_SIZE}
                                strokeWidth={ICON_STROKE}
                            />
                        </button>
                        <button
                            className={styles.button}
                            onClick={() => onEditStart()}
                            disabled={isEditingPossible}
                        >
                            <TbEdit
                                size={ICON_SIZE}
                                strokeWidth={ICON_STROKE}
                            />
                        </button>
                    </div>
                </nav>
                <nav
                    className={styles.controlsLayout}
                    aria-label="Editor actions"
                >
                    <div className={styles.rowLayout}>
                        <button
                            className={styles.button}
                            onClick={() => onUndo()}
                            disabled={!canEditHistory.canUndo}
                        >
                            <TbArrowBack
                                size={ICON_SIZE}
                                strokeWidth={ICON_STROKE}
                            />
                        </button>
                        <button
                            className={styles.button}
                            onClick={() => onRedo()}
                            disabled={!canEditHistory.canRedo}
                        >
                            <TbArrowForward
                                size={ICON_SIZE}
                                strokeWidth={ICON_STROKE}
                            />
                        </button>
                    </div>
                </nav>
                {draft && (
                    <>
                        <nav
                            className={styles.controlsLayout}
                            aria-label="Editor rectangle move controls"
                        >
                            <div className={styles.rowLayout}>
                                <button
                                    className={styles.button}
                                    type="button"
                                    onClick={() =>
                                        onRectChange({
                                            ...draft.rect,
                                            y: draft.rect.y - 5,
                                        })
                                    }
                                >
                                    <TbArrowMoveUp
                                        size={ICON_SIZE}
                                        strokeWidth={ICON_STROKE}
                                    />
                                </button>
                                <button
                                    className={styles.button}
                                    type="button"
                                    onClick={() =>
                                        onRectChange({
                                            ...draft.rect,
                                            y: draft.rect.y + 5,
                                        })
                                    }
                                >
                                    <TbArrowMoveDown
                                        size={ICON_SIZE}
                                        strokeWidth={ICON_STROKE}
                                    />
                                </button>
                            </div>
                            <div className={styles.rowLayout}>
                                <button
                                    className={styles.button}
                                    type="button"
                                    onClick={() =>
                                        onRectChange({
                                            ...draft.rect,
                                            x: draft.rect.x - 5,
                                        })
                                    }
                                >
                                    <TbArrowMoveLeft
                                        size={ICON_SIZE}
                                        strokeWidth={ICON_STROKE}
                                    />
                                </button>
                                <button
                                    className={styles.button}
                                    type="button"
                                    onClick={() =>
                                        onRectChange({
                                            ...draft.rect,
                                            x: draft.rect.x + 5,
                                        })
                                    }
                                >
                                    <TbArrowMoveRight
                                        size={ICON_SIZE}
                                        strokeWidth={ICON_STROKE}
                                    />
                                </button>
                            </div>
                        </nav>

                        <nav
                            className={styles.controlsLayout}
                            aria-label="Editor rectangle size controls"
                        >
                            <div className={styles.rowLayout}>
                                <button
                                    className={styles.button}
                                    type="button"
                                    onClick={() =>
                                        onRectChange({
                                            ...draft.rect,
                                            width: draft.rect.width - 5,
                                        })
                                    }
                                >
                                    <TbArrowAutofitLeft
                                        size={ICON_SIZE}
                                        strokeWidth={ICON_STROKE}
                                    />
                                </button>
                                <button
                                    className={styles.button}
                                    type="button"
                                    onClick={() =>
                                        onRectChange({
                                            ...draft.rect,
                                            width: draft.rect.width + 5,
                                        })
                                    }
                                >
                                    <TbArrowAutofitRight
                                        size={ICON_SIZE}
                                        strokeWidth={ICON_STROKE}
                                    />
                                </button>
                            </div>
                            <div className={styles.rowLayout}>
                                <button
                                    className={styles.button}
                                    type="button"
                                    onClick={() =>
                                        onRectChange({
                                            ...draft.rect,
                                            height: draft.rect.height - 5,
                                        })
                                    }
                                >
                                    <TbArrowAutofitUp
                                        size={ICON_SIZE}
                                        strokeWidth={ICON_STROKE}
                                    />
                                </button>
                                <button
                                    className={styles.button}
                                    type="button"
                                    onClick={() =>
                                        onRectChange({
                                            ...draft.rect,
                                            height: draft.rect.height + 5,
                                        })
                                    }
                                >
                                    <TbArrowAutofitDown
                                        size={ICON_SIZE}
                                        strokeWidth={ICON_STROKE}
                                    />
                                </button>
                            </div>
                        </nav>

                        <nav
                            className={styles.controlsLayout}
                            aria-label="Editor management controls"
                        >
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => onCancel()}>
                                Cancel
                            </button>
                        </nav>
                    </>
                )}
            </form>
            <button
                className={styles.dragBar}
                onPointerDown={(event) => handlePointerDown(event)}
                onPointerMove={(event) => handlePointerMove(event)}
                onPointerCancel={(event) => handlePointerEnd(event)}
                onPointerUp={(event) => handlePointerEnd(event)}
            />
        </div>
    );
}
