import type { Dispatch, RefObject } from "react";
import { useState } from "react";

import type { Action } from "../../../state/DotGridReducer";
import type {
    AreaResize,
    AreaStyle,
    Dot,
    EdgeResize,
} from "../../../types/DotGridTypes";

import { DotGridService } from "../../../services/DotGridService";

import styles from "./ResizeDragBox.module.css";
// -----------------------------------------------------------------------------

type ResizeDragBoxProps = {
    canvasRef: RefObject<HTMLDivElement | null>;
    id: string;
    area: AreaStyle;
    dispatch: Dispatch<Action>;
    onResizeArea: (distance: AreaResize | null) => void;
};

const service = new DotGridService();

export default function ResizeDragBox({
    canvasRef,
    id,
    area,
    dispatch,
    onResizeArea,
}: ResizeDragBoxProps) {
    const [resizeEdge, setResizeEdge] = useState<EdgeResize | null>(null);

    const { width, height } = area;
    const dragBarSize = 7.5;

    function handleItemResizeStart(
        e: React.PointerEvent<HTMLDivElement>,
        edge: EdgeResize,
    ) {
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        setResizeEdge(edge);
    }
    function handleItemResizeMove(
        e: React.PointerEvent<HTMLDivElement>,
        id: string | null,
        area: AreaStyle,
    ) {
        e.stopPropagation();

        if (!resizeEdge) return;

        const nextDot = service.getCanvasDot(e, canvasRef);
        if (!nextDot) return;

        const offset = service.gridSize / 2;

        const leftDot: Dot = {
            x: area.left + offset,
            y: nextDot.y,
        };

        const rightDot: Dot = {
            x: area.left + area.width - offset,
            y: nextDot.y,
        };

        const topDot: Dot = {
            x: nextDot.x,
            y: area.top + offset,
        };

        const bottomDot: Dot = {
            x: nextDot.x,
            y: area.top + area.height - offset,
        };

        const nextArea =
            resizeEdge === "left"
                ? service.updateItemWidth(nextDot, rightDot)
                : resizeEdge === "right"
                  ? service.updateItemWidth(leftDot, nextDot)
                  : resizeEdge === "top"
                    ? service.updateItemHeight(nextDot, bottomDot)
                    : service.updateItemHeight(topDot, nextDot);

        if (id) {
            dispatch({
                type: "item/resize",
                payload: { id: id, nextArea: nextArea },
            });
        } else {
            onResizeArea(nextArea);
        }
    }

    function handleItemResizeEnd(e: React.PointerEvent<HTMLDivElement>) {
        e.stopPropagation();

        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }

        setResizeEdge(null);
    }

    function handleEditItem(id: string) {
        dispatch({
            type: "editing/item",
            payload: id,
        });
    }

    return (
        <div
            className={styles.dragBarContainer}
            style={{ ...area }}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerMove={(e) => e.stopPropagation()}
        >
            <div
                className={styles.dragBar}
                style={{
                    top: 0,
                    width: width - 2,
                    height: dragBarSize,
                    cursor: "row-resize",
                }}
                onPointerDown={(e) => handleItemResizeStart(e, "top")}
                onPointerMove={(e) => handleItemResizeMove(e, id, area)}
                onPointerUp={handleItemResizeEnd}
                onPointerCancel={handleItemResizeEnd}
            />
            <div
                className={styles.dragBar}
                style={{
                    bottom: 0,
                    width: width - 2,
                    height: dragBarSize,
                    cursor: "row-resize",
                }}
                onPointerDown={(e) => handleItemResizeStart(e, "bottom")}
                onPointerMove={(e) => handleItemResizeMove(e, id, area)}
                onPointerUp={handleItemResizeEnd}
                onPointerCancel={handleItemResizeEnd}
            />
            <div
                className={styles.dragBar}
                style={{
                    left: 0,
                    height: height - 2,
                    width: dragBarSize,
                    cursor: "col-resize",
                }}
                onPointerDown={(e) => handleItemResizeStart(e, "left")}
                onPointerMove={(e) => handleItemResizeMove(e, id, area)}
                onPointerUp={handleItemResizeEnd}
                onPointerCancel={handleItemResizeEnd}
            />
            <div
                className={styles.dragBar}
                style={{
                    right: 0,
                    height: height - 2,
                    width: dragBarSize,
                    cursor: "col-resize",
                }}
                onPointerDown={(e) => handleItemResizeStart(e, "right")}
                onPointerMove={(e) => handleItemResizeMove(e, id, area)}
                onPointerUp={handleItemResizeEnd}
                onPointerCancel={handleItemResizeEnd}
            />
            <button
                className={styles.button}
                onClick={() => handleEditItem(id)}
            >
                Edit
            </button>
        </div>
    );
}
