import type { ReactElement } from "react";
import React, { useEffect, useRef, useState } from "react";

import type { DotGridProps } from "./types/DotGridProps";
import type { AreaResize, Dot } from "./types/DotGridTypes";

import { DotGridService } from "./services/DotGridService";
import { defaultStyle } from "./tool/TextTool/TextStyles";

import DisplayItems from "./components/Canvas/DisplayItems";

import styles from "./Canvas.module.css";
import type { Rect } from "../../model/SquareDotDocument";
// -----------------------------------------------------------------------------

const service = new DotGridService();

export default function Canvas({
    state,
    dispatch,
}: DotGridProps): ReactElement {
    const canvasRef = useRef<HTMLDivElement>(null);

    const [resizeArea, setResizeArea] = useState<AreaResize | null>(null);

    const [hoverDot, setHoverDot] = useState<Dot | null>(null);

    const [selectionDrag, setSelectionDrag] = useState<{
        start: Dot;
        area: Rect | null;
    } | null>(null);

    useEffect(() => {
        function handleWindowKeyDown(e: KeyboardEvent) {
            if (e.key !== "Escape") return;

            setSelectionDrag(null);

            dispatch({ type: "editing/cancel" });
        }

        window.addEventListener("keydown", handleWindowKeyDown);

        return () => window.removeEventListener("keydown", handleWindowKeyDown);
    }, [dispatch]);

    function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
        e.currentTarget.setPointerCapture(e.pointerId);

        const start = service.getCanvasDot(e, canvasRef);
        if (!start) return;

        setSelectionDrag({
            start,
            area: null,
        });
    }

    function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
        const end = service.getCanvasDot(e, canvasRef);
        if (!end) return;

        setHoverDot(end);

        if (!selectionDrag) return;

        setSelectionDrag({
            ...selectionDrag,
            area: service.updateTempArea(selectionDrag.start, end),
        });
    }

    function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
        if (!selectionDrag) return;

        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }

        const area = selectionDrag.area;
        if (!area) return;

        if (state.mode.kind === "editing") {
            dispatch({
                type: "area/tool",
                payload: area,
            });
        } else {
            dispatch({
                type: "area/selected",
                payload: area,
            });
        }

        setSelectionDrag(null);
    }

    function handlePointerCancel() {
        setSelectionDrag(null);
    }

    return (
        <div
            ref={canvasRef}
            className={`
                ${styles.container}
                ${state.mode.kind === "editing" ? styles.focusToolArea : styles.focusContainer}
                `}
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            style={{
                backgroundSize: `${service.gridSize}px ${service.gridSize}px`,
            }}
        >
            {hoverDot && (
                <div
                    className={styles.hoverDot}
                    style={{ left: hoverDot.x, top: hoverDot.y }}
                />
            )}
            {selectionDrag && (
                <div
                    className={styles.dragStartDot}
                    style={{
                        left: selectionDrag.start.x,
                        top: selectionDrag.start.y,
                    }}
                />
            )}
            {selectionDrag && (
                <div
                    className={styles.draftArea}
                    style={{ ...selectionDrag.area }}
                />
            )}
            {state.mode.kind === "area-selected" && (
                <div
                    className={styles.selectArea}
                    style={{ ...state.mode.area }}
                />
            )}
            {state.mode.kind === "editing" && (
                <textarea
                    value={state.mode.draft.text}
                    onChange={(e) =>
                        dispatch({
                            type: "item/text",
                            payload: e.target.value,
                        })
                    }
                    onPointerDown={(e) => e.stopPropagation()}
                    className={`${styles[state.mode.kind]} ${styles.activeTool}`}
                    style={{
                        ...defaultStyle,
                        alignContent: state.mode.draft.style.alignContent,
                        textAlign: state.mode.draft.style.alignText,
                        backgroundColor:
                            state.mode.draft.style.colourBackground,
                        color: state.mode.draft.style.colourForeground,
                        fontSize: `${state.mode.draft.style.fontSize}rem`,
                        fontWeight: state.mode.draft.style.fontWeight,
                        paddingTop: `${state.mode.draft.style.paddingTop}px`,
                        paddingRight: `${state.mode.draft.style.paddingRight}px`,
                        paddingBottom: `${state.mode.draft.style.paddingBottom}px`,
                        paddingLeft: `${state.mode.draft.style.paddingLeft}px`,
                        ...state.mode.draft.area,
                        ...resizeArea,
                    }}
                />
            )}
            <DisplayItems
                canvasRef={canvasRef}
                items={state.document.items}
                dispatch={dispatch}
                onResizeArea={setResizeArea}
            />
        </div>
    );
}
