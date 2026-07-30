import { useRef, useState, type Dispatch, type ReactElement } from "react";

import type { SingleDot } from "../../types/DotTypes";
import type { Rect } from "../../model/DotDocument";

import { DotGeometryService } from "../../services/DotGeometryService";

import styles from "./Canvas.module.css";
import type { DotState } from "../../model/DotDocumentState";
import type { Action } from "../../state/DotReducer";
import { dotConfig } from "../../dotConfig/DotConfig";
// -----------------------------------------------------------------------------

type CanvasProps = {
    state: DotState;
    dispatch: Dispatch<Action>;
};

const geo = new DotGeometryService(dotConfig.gridSpacing);

export default function Canvas({ state, dispatch }: CanvasProps): ReactElement {
    const canvasRef = useRef(null);

    const [hoverDot, setHoverDot] = useState<SingleDot | null>(null);
    const [startDot, setStartDot] = useState<SingleDot | null>(null);

    const [tempArea, setTempArea] = useState<Rect | null>(null);

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
        const end = geo.getCanvasDot(e, canvasRef);
        if (!end) return;

        if (!startDot) return;
        if (geo.isSameDot(startDot, end)) return;

        const area = geo.updateTempArea(startDot, end);

        setTempArea(null);
        setStartDot(null);

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
                className={`${styles.container} ${styles.canvas}`}
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
                        className={styles.tempArea}
                        style={{
                            left: tempArea.left,
                            width: tempArea.width,
                            top: tempArea.top,
                            height: tempArea.height,
                        }}
                    />
                )}
                {state.canvasMode.mode === "drawing" && (
                    <div
                        className={styles.selectArea}
                        style={{
                            left: state.canvasMode.area.left,
                            width: state.canvasMode.area.width,
                            top: state.canvasMode.area.top,
                            height: state.canvasMode.area.height,
                        }}
                    />
                )}
                {state.canvasMode.mode === "editing" && (
                    <div
                        className={styles.editArea}
                        style={{
                            left: state.canvasMode.element.area.left,
                            width: state.canvasMode.element.area.width,
                            top: state.canvasMode.element.area.top,
                            height: state.canvasMode.element.area.height,
                        }}
                    />
                )}
            </div>
        </>
    );
}
