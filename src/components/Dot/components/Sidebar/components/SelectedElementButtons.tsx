import type { ReactElement } from "react";
import {
    inheritableGeometryAttributes,
    inheritableStyleAttributes,
    type CanvasElement,
    type InheritableGeometryAttribute,
    type InheritableStyleAttribute,
} from "../../../model/DotDocument";
import type { DotStateProps } from "../../../state/DotStateProps";

import stylesBtn from "../styles/Button.module.css";
import styles from "./SelectedElementButtons.module.css";

const attributeLabels = {
    width: "Width",
    height: "Height",
    alignContent: "Content alignment",
    alignText: "Text alignment",
    colourBackground: "Background colour",
    colourForeground: "Foreground colour",
    fontSize: "Font size",
    fontWeight: "Font weight",
    paddingTop: "Top padding",
    paddingRight: "Right padding",
    paddingBottom: "Bottom padding",
    paddingLeft: "Left padding",
} satisfies Record<
    InheritableGeometryAttribute | InheritableStyleAttribute,
    string
>;

function elementLabel(element: CanvasElement, index: number) {
    return element.text.trim() || `Element ${index + 1}`;
}

export default function SelctedElementButtons({
    state,
    dispatch,
}: DotStateProps): ReactElement {
    const selectedElements = state.document.elements.filter(
        (element) => state.selectedElementIds.has(element.id),
    );
    const selectedChildRelationships = state.document.relationships.filter(
        (relationship) => state.selectedElementIds.has(relationship.childId),
    );

    const selectedParent =
        selectedElements.length === 1 &&
        state.document.relationships.some(
            (relationship) =>
                relationship.parentId === selectedElements[0].id,
        )
            ? selectedElements[0]
            : null;

    if (selectedElements.length <= 0) return <></>;

    return (
        <div className={stylesBtn.buttonsContainer}>
            <p className={stylesBtn.btnHeader}>SELECTED</p>
            <button
                className={stylesBtn.btn}
                onClick={() => dispatch({ type: "element/deselect" })}
            >
                clear
            </button>
            <button
                className={stylesBtn.btn}
                onClick={() =>
                    selectedElements.map((el) =>
                        dispatch({
                            type: "element/copy",
                            payload: { id: el.id, newId: crypto.randomUUID() },
                        }),
                    )
                }
            >
                copy
            </button>
            <button
                className={stylesBtn.btn}
                disabled={state.canvasMode.mode === "editing"}
                onClick={() =>
                    selectedElements.map((el) =>
                        dispatch({
                            type: "element/delete",
                            payload: el.id,
                        }),
                    )
                }
            >
                delete
            </button>

            {selectedElements.length >= 2 && (
                <section className={styles.section}>
                    <p className={stylesBtn.btnHeader}>SET PARENT</p>
                    <p className={styles.hint}>
                        Choose the parent for the other selected elements.
                    </p>
                    {selectedElements.map((parent, index) => (
                        <button
                            key={parent.id}
                            className={stylesBtn.btn}
                            onClick={() => {
                                selectedElements
                                    .filter((child) => child.id !== parent.id)
                                    .forEach((child) =>
                                        dispatch({
                                            type: "relationship/parent/set",
                                            payload: {
                                                parentId: parent.id,
                                                childId: child.id,
                                            },
                                        }),
                                    );

                                dispatch({ type: "element/deselect" });
                            }}
                        >
                            make {elementLabel(parent, index)} parent
                        </button>
                    ))}
                </section>
            )}

            {selectedChildRelationships.length > 0 && (
                <button
                    className={stylesBtn.btn}
                    onClick={() =>
                        selectedChildRelationships.forEach((relationship) =>
                            dispatch({
                                type: "relationship/parent/unset",
                                payload: relationship.childId,
                            }),
                        )
                    }
                >
                    unlink from parent
                </button>
            )}

            {selectedParent && (
                <section className={styles.section}>
                    <p className={stylesBtn.btnHeader}>CHILD INHERITANCE</p>
                    <fieldset className={styles.fieldset}>
                        <legend>Geometry</legend>
                        {inheritableGeometryAttributes.map((attribute) => (
                            <label className={styles.option} key={attribute}>
                                <input
                                    type="checkbox"
                                    aria-label={`Children inherit ${attributeLabels[attribute].toLowerCase()}`}
                                    checked={selectedParent.childInheritance.geometry.includes(
                                        attribute,
                                    )}
                                    onChange={(event) =>
                                        dispatch({
                                            type: "inheritance/attribute/set",
                                            payload: {
                                                parentId: selectedParent.id,
                                                group: "geometry",
                                                attribute,
                                                enabled: event.target.checked,
                                            },
                                        })
                                    }
                                />
                                {attributeLabels[attribute]}
                            </label>
                        ))}
                    </fieldset>

                    <fieldset className={styles.fieldset}>
                        <legend>Style</legend>
                        {inheritableStyleAttributes.map((attribute) => (
                            <label className={styles.option} key={attribute}>
                                <input
                                    type="checkbox"
                                    aria-label={`Children inherit ${attributeLabels[attribute].toLowerCase()}`}
                                    checked={selectedParent.childInheritance.style.includes(
                                        attribute,
                                    )}
                                    onChange={(event) =>
                                        dispatch({
                                            type: "inheritance/attribute/set",
                                            payload: {
                                                parentId: selectedParent.id,
                                                group: "style",
                                                attribute,
                                                enabled: event.target.checked,
                                            },
                                        })
                                    }
                                />
                                {attributeLabels[attribute]}
                            </label>
                        ))}
                    </fieldset>
                </section>
            )}
        </div>
    );
}
