import type { ReactElement } from "react";
import type { TextElement } from "../../../domain/elements/TextElement";
import type { Rect } from "../../../domain/geometry/Rect";

import styles from "./Sidebar.module.css";

type SidebarProps = {
    isEditing: boolean;
    isEditPossible: boolean;
    draft: TextElement | null;
    onSave: () => void;
    onCancel: () => void;
    onUndo: () => void;
    onRedo: () => void;
    onAddText: () => void;
    onRectChange: (rectUpdate: Rect) => void;
    onEditStart: () => void;
};

export default function Sidebar({
    isEditing,
    isEditPossible,
    draft,
    onSave,
    onCancel,
    onUndo,
    onRedo,
    onAddText,
    onRectChange,
    onEditStart,
}: SidebarProps): ReactElement {
    const isEditingPossible = !isEditPossible || isEditing;

    return (
        <div className={styles.sidebar}>
            <form
                className={styles.sidebarLayout}
                style={{ display: "flex", flexDirection: "column" }}
                onSubmit={(event) => {
                    event.preventDefault();
                    onSave();
                }}
            >
                <nav
                    className={styles.buttonLayout}
                    aria-label="Editor actions"
                >
                    <button onClick={() => onAddText()} disabled={isEditing}>
                        Add text
                    </button>
                    <button
                        onClick={() => onEditStart()}
                        disabled={isEditingPossible}
                    >
                        Edit
                    </button>
                    <button onClick={() => onUndo()}>Undo</button>
                    <button onClick={() => onRedo()}>Redo</button>
                </nav>
                {draft && (
                    <>
                        <nav
                            className={styles.buttonLayout}
                            aria-label="Editor rectangle controls"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    onRectChange({
                                        ...draft.rect,
                                        x: draft.rect.x + 5,
                                    })
                                }
                            >
                                Right
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    onRectChange({
                                        ...draft.rect,
                                        y: draft.rect.y + 5,
                                    })
                                }
                            >
                                Down
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    onRectChange({
                                        ...draft.rect,
                                        x: draft.rect.x - 5,
                                    })
                                }
                            >
                                Left
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    onRectChange({
                                        ...draft.rect,
                                        y: draft.rect.y - 5,
                                    })
                                }
                            >
                                Up
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    onRectChange({
                                        ...draft.rect,
                                        width: draft.rect.width + 5,
                                    })
                                }
                            >
                                Width +
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    onRectChange({
                                        ...draft.rect,
                                        width: draft.rect.width - 5,
                                    })
                                }
                            >
                                Width -
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    onRectChange({
                                        ...draft.rect,
                                        height: draft.rect.height + 5,
                                    })
                                }
                            >
                                Height +
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    onRectChange({
                                        ...draft.rect,
                                        height: draft.rect.height - 5,
                                    })
                                }
                            >
                                Height -
                            </button>
                        </nav>
                        <nav
                            className={styles.buttonLayout}
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
        </div>
    );
}
