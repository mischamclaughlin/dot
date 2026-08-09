import { useState, type ReactElement } from "react";

import { dotConfig } from "../../../dotConfig/DotConfig";
import { DotGeometryService } from "../../../services/DotGeometryService";

import styles from "./DragBar.module.css";
// -----------------------------------------------------------------------------

const geo = new DotGeometryService(dotConfig.gridSpacing);

type DragBarProps = { onSetWidth: (width: number) => void };

export default function DragBar({ onSetWidth }: DragBarProps): ReactElement {
    const [isDragging, setIsDragging] = useState(false);

    function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
        e.currentTarget.setPointerCapture(e.pointerId);
        setIsDragging(true);
    }

    function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
        if (!isDragging) return;

        const parent = e.currentTarget.parentElement?.parentElement;
        if (!parent) return;

        const parentRect = parent.getBoundingClientRect();

        const maxWidth = Math.max(
            dotConfig.minWidth,
            parentRect.width * dotConfig.maxWidthRatio,
        );
        const nextWidth = e.clientX - parentRect.left;

        const snappedWidth = geo.snapToGrid(nextWidth, maxWidth);

        onSetWidth(Math.max(dotConfig.minWidth, snappedWidth));
    }

    function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }

        setIsDragging(false);
    }
    return (
        <div
            className={styles.dragBox}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            <div className={styles.dragBar} />
        </div>
    );
}
