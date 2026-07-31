import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";

import type { Rect } from "../../model/DotDocument";
import type { DotStateProps } from "../../state/DotStateProps";
import type { SingleDot } from "../../types/DotTypes";

import { dotConfig } from "../../dotConfig/DotConfig";
import { DotGeometryService } from "../../services/DotGeometryService";

import DragBox from "./components/DragBox";

import styles from "./Canvas.module.css";
import stylesArea from "./styles/Area.module.css";
// -----------------------------------------------------------------------------

const geo = new DotGeometryService(dotConfig.gridSpacing);

export default function Canvas({
    state,
    dispatch,
}: DotStateProps): ReactElement {
    const canvasRef = useRef(null);

    const [hoverDot, setHoverDot] = useState<SingleDot | null>(null);
    const [startDot, setStartDot] = useState<SingleDot | null>(null);

    const [tempArea, setTempArea] = useState<Rect | null>(null);

    useEffect(() => {
        function handleWindowKeyDown(e: KeyboardEvent) {
            if (e.key !== "Escape") return;

            setTempArea(null);
            setStartDot(null);
            dispatch({ type: "action/cancel" });
        }

        window.addEventListener("keydown", handleWindowKeyDown);

        return () => window.removeEventListener("keydown", handleWindowKeyDown);
    }, [dispatch]);

    function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
        const start = geo.getCanvasDot(e, canvasRef);
        setStartDot(start);
    }

    function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
        const current = geo.getCanvasDot(e, canvasRef);
        if (!current) return;

        setHoverDot(current);

        if (!startDot) return;
        if (geo.isSameDot(startDot, current)) return;

        const area = geo.updateTempArea(startDot, current);
        setTempArea(area);
    }

    function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
        const tempStartDot = startDot;

        setStartDot(null);

        const end = geo.getCanvasDot(e, canvasRef);
        if (!end) return;

        if (!tempStartDot) return;
        if (geo.isSameDot(tempStartDot, end)) return;

        const area = geo.updateTempArea(tempStartDot, end);

        setTempArea(null);

        dispatch({
            type: "canvasMode/switch",
            payload: {
                toolType: state.toolType,
                area: area,
            },
        });
    }

    return (
        <>
            <div
                className={`
                        ${styles.container}
                        ${
                            state.canvasMode.mode === "editing"
                                ? styles.canvasEdit
                                : styles.canvas
                        }
                    `}
                style={{
                    backgroundSize: `${geo.gridSize}px ${geo.gridSize}px`,
                }}
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                {hoverDot && (
                    <div
                        className={styles.hoverDot}
                        style={{ left: hoverDot.x, top: hoverDot.y }}
                    />
                )}
                {tempArea && (
                    <div
                        className={stylesArea.tempArea}
                        style={{
                            left: tempArea.left,
                            width: tempArea.width,
                            top: tempArea.top,
                            height: tempArea.height,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                        }}
                    />
                )}
                {state.canvasMode.mode === "drawing" && (
                    <>
                        <div
                            className={stylesArea.selectArea}
                            style={{
                                left: state.canvasMode.area.left,
                                width: state.canvasMode.area.width,
                                top: state.canvasMode.area.top,
                                height: state.canvasMode.area.height,
                            }}
                            onPointerDown={(e) => {
                                e.stopPropagation();
                            }}
                        />
                        <DragBox
                            state={state}
                            dispatch={dispatch}
                            canvasRef={canvasRef}
                        />
                    </>
                )}
                {state.canvasMode.mode === "editing" &&
                    state.canvasMode.element.area && (
                        <>
                            <textarea
                                className={stylesArea.editArea}
                                style={{
                                    left: state.canvasMode.element.area.left,
                                    width: state.canvasMode.element.area.width,
                                    top: state.canvasMode.element.area.top,
                                    height: state.canvasMode.element.area
                                        .height,
                                }}
                                onPointerDown={(e) => {
                                    e.stopPropagation();
                                }}
                            />
                            <DragBox
                                state={state}
                                dispatch={dispatch}
                                canvasRef={canvasRef}
                            />
                        </>
                    )}
            </div>
        </>
    );
}
