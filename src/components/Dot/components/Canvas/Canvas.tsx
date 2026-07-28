import { useRef, useState, type ReactElement } from "react";

import type { SingleDot } from "../../types/DotTypes";

import { DotGeometryService } from "../../services/DotGeometryService";

import styles from "./Canvas.module.css";
// -----------------------------------------------------------------------------

const geo = new DotGeometryService();

export default function Canvas(): ReactElement {
    const canvasRef = useRef(null);

    const [hoverDot, setHoverDot] = useState<SingleDot | null>(null);

    function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
        const end = geo.getCanvasDot(e, canvasRef);
        if (!end) return;

        setHoverDot(end);
    }

    return (
        <>
            <div
                className={`${styles.container} ${styles.canvas}`}
                style={{
                    backgroundSize: `${geo.gridSize}px ${geo.gridSize}px`,
                }}
                ref={canvasRef}
                onPointerMove={handlePointerMove}
            >
                <div
                    className={styles.hoverDot}
                    style={{ left: hoverDot?.x, top: hoverDot?.y }}
                />
            </div>
        </>
    );
}
