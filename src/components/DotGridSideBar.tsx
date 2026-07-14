import React, { useState, type ReactElement } from "react";

import styles from "./DotGridSideBar.module.css";

export default function DotGridSideBar(): ReactElement {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [width, setWidth] = useState<number>(150);

    function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
        e.currentTarget.setPointerCapture(e.pointerId);
        setIsDragging(true);
    }

    function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
        if (!isDragging) return;

        setWidth(e.clientX);
    }

    function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
        e.currentTarget.setPointerCapture(e.pointerId);
        setIsDragging(false);
    }

    return (
        <>
            <div
                className={styles.container}
                style={{ minWidth: `${width}px` }}
            >
                <p>DotGrid</p>
                <div
                    className={styles.dragBar}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                >
                    <div className={styles.bar} />
                </div>
            </div>
        </>
    );
}
