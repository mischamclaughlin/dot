import { useRef, useState, type Dispatch, type ReactElement } from "react";

import { DotGeometryService } from "../../services/DotGeometryService";

import styles from "./Sidebar.module.css";
import type { DotState } from "../../model/DotDocumentState";
import { initialRect, type Action } from "../../state/DotReducer";
// -----------------------------------------------------------------------------

const minWidth = 140;
const maxWidthRatio = 0.8;

const geo = new DotGeometryService();

type CanvasProps = {
    state: DotState;
    dispatch: Dispatch<Action>;
};

export default function Sidebar({
    state,
    dispatch,
}: CanvasProps): ReactElement {
    const sideBarRef = useRef(null);

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const [width, setWidth] = useState<number>(minWidth);

    function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
        e.currentTarget.setPointerCapture(e.pointerId);
        setIsDragging(true);
    }

    function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
        if (!isDragging) return;

        const parent = e.currentTarget.parentElement?.parentElement;
        if (!parent) return;

        const parentRect = parent.getBoundingClientRect();

        const maxWidth = Math.max(minWidth, parentRect.width * maxWidthRatio);
        const nextWidth = e.clientX - parentRect.left;

        const snappedWidth = geo.snapToGrid(nextWidth, maxWidth);

        setWidth(Math.max(minWidth, snappedWidth));
    }

    function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }

        setIsDragging(false);
    }

    function handleToolSelect() {
        if (state.canvasMode.mode === "idle") {
            dispatch({
                type: "canvasMode/switch",
                payload: {
                    toolType: "text",
                    area: initialRect,
                },
            });
        }

        if (state.canvasMode.mode === "drawing") {
            dispatch({
                type: "canvasMode/switch",
                payload: {
                    toolType: "text",
                    area: state.canvasMode.area,
                },
            });
        }
    }

    return (
        <>
            {!isFullscreen && (
                <div
                    className={styles.container}
                    style={{ minWidth: `${minWidth}px`, width: `${width}px` }}
                    ref={sideBarRef}
                >
                    <div className={styles.sidebarContainer}>
                        <h1 className={styles.header}>Dot.</h1>
                        <h2 className={styles.headerTool}>
                            {state.toolType?.toUpperCase() ?? "TOOL"}
                        </h2>
                        <h3 className={styles.headerTool}>
                            {state.canvasMode.mode}
                        </h3>
                        {state.canvasMode.mode === "editing" && (
                            <div className={styles.optionContainer}>
                                <button
                                    className={styles.btn}
                                    onClick={() =>
                                        dispatch({
                                            type: "canvasMode/back",
                                        })
                                    }
                                >
                                    back
                                </button>
                                <button
                                    className={styles.btn}
                                    onClick={() =>
                                        dispatch({
                                            type: "canvasMode/cancel",
                                        })
                                    }
                                >
                                    cancel
                                </button>
                                <button
                                    className={styles.btn}
                                    disabled={
                                        state.canvasMode.element.area ===
                                        initialRect
                                    }
                                    onClick={() => {}}
                                >
                                    save
                                </button>
                            </div>
                        )}
                        {!state.toolType && (
                            <div className={styles.optionContainer}>
                                <button
                                    className={styles.btn}
                                    onClick={handleToolSelect}
                                >
                                    text
                                </button>
                                <button className={styles.btn}>
                                    coming soon.
                                </button>
                                <button className={styles.btn}>
                                    coming soon.
                                </button>
                                <button className={styles.btn}>
                                    coming soon.
                                </button>
                            </div>
                        )}
                    </div>
                    <div
                        className={styles.dragBox}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                    >
                        <div className={styles.dragBar} />
                    </div>
                </div>
            )}
            <button
                className={`${styles.btn} ${styles.fullscreenBtn}`}
                style={{
                    minWidth: `${minWidth - 25}px`,
                    width: `${width - 25}px`,
                }}
                onClick={() => setIsFullscreen((f) => !f)}
            >
                Fullscreen
            </button>
        </>
    );
}
