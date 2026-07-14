import React, { useState, type ReactElement } from "react";

import type { CanvasTool } from "./types/DotGridTypes";
import { MAX_WIDTH_RATIO } from "./DotGrid";

import styles from "./SideBar.module.css";

type SideBarProps = {
    activeTool: CanvasTool;
    onSelectTool: (tool: CanvasTool) => void;
};

export default function SideBar({
    activeTool,
    onSelectTool,
}: SideBarProps): ReactElement {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [width, setWidth] = useState<number>(150);

    function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
        e.currentTarget.setPointerCapture(e.pointerId);
        setIsDragging(true);
    }

    function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
        if (!isDragging) return;

        const parent = e.currentTarget.parentElement?.parentElement;

        if (!parent) return;

        const parentRect = parent.getBoundingClientRect();
        const nextWidth = e.clientX - parentRect.left;
        const maxWidth = parentRect.width * MAX_WIDTH_RATIO;

        setWidth(Math.max(0, Math.min(nextWidth, maxWidth)));
    }

    function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
        e.currentTarget.releasePointerCapture(e.pointerId);
        setIsDragging(false);
    }

    return (
        <>
            <div className={styles.container} style={{ width: `${width}px` }}>
                <div className={styles.sideBarContainer}>
                    <h1 className={styles.title}>Dot.</h1>
                    <div className={styles.actionContainer}>
                        <button
                            className={
                                activeTool === "text"
                                    ? `${styles[activeTool]} ${styles.active}`
                                    : undefined
                            }
                            onClick={() => onSelectTool("text")}
                        >
                            Text
                        </button>
                        <button
                            className={
                                activeTool === "image"
                                    ? `${styles[activeTool]} ${styles.active}`
                                    : undefined
                            }
                            onClick={() => onSelectTool("image")}
                        >
                            Image
                        </button>
                        <button
                            className={
                                activeTool === "component"
                                    ? `${styles[activeTool]} ${styles.active}`
                                    : undefined
                            }
                            onClick={() => onSelectTool("component")}
                        >
                            Component
                        </button>
                        <button
                            className={
                                activeTool === "describe"
                                    ? `${styles[activeTool]} ${styles.active}`
                                    : undefined
                            }
                            onClick={() => onSelectTool("describe")}
                        >
                            Describe
                        </button>
                    </div>
                </div>
                <div
                    className={styles.dragBarContainer}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                >
                    <div className={styles.dragBar} />
                </div>
            </div>
        </>
    );
}
