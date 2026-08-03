import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";

import type { Rect } from "../../model/DotDocument";
import type { DotStateProps } from "../../state/DotStateProps";
import type { SingleDot } from "../../types/DotTypes";

import { dotConfig } from "../../dotConfig/DotConfig";
import { DotGeometryService } from "../../services/DotGeometryService";

import DrawingMode from "./components/DrawingMode";
import EditingMode from "./components/EditingMode";
import SavedElements from "./components/SavedElements";

import styles from "./Canvas.module.css";
import stylesArea from "./styles/Area.module.css";
// -----------------------------------------------------------------------------

const geo = new DotGeometryService(dotConfig.gridSpacing);

type PanStart = {
    pointerX: number;
    pointerY: number;
    pan: SingleDot;
};

export default function Canvas({
    state,
    dispatch,
}: DotStateProps): ReactElement {
    const canvasRef = useRef<HTMLDivElement>(null);
    const worldRef = useRef<HTMLDivElement>(null);

    const [panStart, setPanStart] = useState<PanStart | null>(null);
    const [isCommandPressed, setIsCommandPressed] = useState(false);

    const [pan, setPan] = useState<SingleDot>({ x: 0, y: 0 });
    const [hoverDot, setHoverDot] = useState<SingleDot | null>(null);
    const [startDot, setStartDot] = useState<SingleDot | null>(null);

    const [tempArea, setTempArea] = useState<Rect | null>(null);

    useEffect(() => {
        function handleWindowKeyDown(e: KeyboardEvent) {
            if (e.key === "Meta") setIsCommandPressed(true);
            if (e.key !== "Escape") return;

            setTempArea(null);
            setStartDot(null);
            dispatch({ type: "action/cancel" });
        }

        function handleWindowKeyUp(e: KeyboardEvent) {
            if (e.key === "Meta") setIsCommandPressed(false);
        }

        function handleWindowBlur() {
            setIsCommandPressed(false);
            setPanStart(null);
        }

        window.addEventListener("keydown", handleWindowKeyDown);
        window.addEventListener("keyup", handleWindowKeyUp);
        window.addEventListener("blur", handleWindowBlur);

        return () => {
            window.removeEventListener("keydown", handleWindowKeyDown);
            window.removeEventListener("keyup", handleWindowKeyUp);
            window.removeEventListener("blur", handleWindowBlur);
        };
    }, [dispatch]);

    function beginPan(e: React.PointerEvent<HTMLDivElement>) {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);

        setPanStart({
            pointerX: e.clientX,
            pointerY: e.clientY,
            pan,
        });
    }

    function endPan(e: React.PointerEvent<HTMLDivElement>) {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }

        setPanStart(null);
    }

    function continuePan(e: React.PointerEvent<HTMLDivElement>) {
        if (!panStart) return;

        setPan({
            x: panStart.pan.x + e.clientX - panStart.pointerX,
            y: panStart.pan.y + e.clientY - panStart.pointerY,
        });
    }

    function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
        if (e.button === 0 && e.metaKey) {
            beginPan(e);
            return;
        }

        if (e.target !== e.currentTarget && e.target !== worldRef.current)
            return;

        const start = geo.getCanvasDot(e, canvasRef, pan);
        setStartDot(start);
    }

    function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
        if (panStart) {
            continuePan(e);
            return;
        }

        const current = geo.getCanvasDot(e, canvasRef, pan);
        if (!current) return;

        setHoverDot(current);

        if (!startDot) return;
        if (geo.isSameDot(startDot, current)) return;

        const area = geo.updateTempArea(startDot, current);
        setTempArea(area);
    }

    function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
        if (panStart) {
            endPan(e);
            return;
        }

        const tempStartDot = startDot;

        setStartDot(null);

        const end = geo.getCanvasDot(e, canvasRef, pan);
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

    function handlePointerCancel(e: React.PointerEvent<HTMLDivElement>) {
        if (panStart) {
            endPan(e);
            return;
        }

        setStartDot(null);
        setTempArea(null);

        dispatch({ type: "action/cancel" });
    }

    return (
        <div
            data-testid="canvas"
            className={`
                        ${styles.container}
                        ${
                            state.canvasMode.mode === "editing"
                                ? styles.canvasEdit
                                : styles.canvas
                        }
                        ${
                            panStart
                                ? styles.panning
                                : isCommandPressed
                                  ? styles.panReady
                                  : ""
                        }
                    `}
            style={{
                backgroundSize: `${geo.gridSize}px ${geo.gridSize}px`,
                backgroundPosition: `${pan.x}px ${pan.y}px`,
            }}
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onLostPointerCapture={() => setPanStart(null)}
        >
            <div
                ref={worldRef}
                className={styles.world}
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px)`,
                }}
            >
                {hoverDot && (
                    <div
                        data-testid="hover-dot"
                        className={styles.hoverDot}
                        style={{ left: hoverDot.x, top: hoverDot.y }}
                    />
                )}
                {tempArea && (
                    <div
                        data-testid="temp-area"
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
                <DrawingMode
                    state={state}
                    dispatch={dispatch}
                    canvasRef={canvasRef}
                    pan={pan}
                />
                <EditingMode
                    state={state}
                    dispatch={dispatch}
                    canvasRef={canvasRef}
                    pan={pan}
                />
                <SavedElements
                    state={state}
                    dispatch={dispatch}
                    canvasRef={canvasRef}
                    pan={pan}
                />
            </div>
        </div>
    );
}
