import React, { type ReactElement, useState } from "react";

import type { AreaStyle, CanvasTool } from "./types/DotGridTypes";

import { MAX_WIDTH_RATIO } from "./DotGrid";

import styles from "./SideBar.module.css";

type SideBarProps = {
    activeTool: CanvasTool;
    onSelectTool: (tool: CanvasTool) => void;
    onSelectStyle: (style: AreaStyle) => void;
    onSaveElement: (isSave: boolean) => void;
};

export default function SideBar({
    activeTool,
    onSelectTool,
    onSelectStyle,
    onSaveElement,
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
                        {!activeTool && (
                            <>
                                <button
                                    className={
                                        activeTool === "text"
                                            ? `${styles[activeTool]} ${styles.active} ${styles.button}`
                                            : styles.button
                                    }
                                    onClick={() => onSelectTool("text")}
                                >
                                    Text
                                </button>
                                <button
                                    className={
                                        activeTool === "image"
                                            ? `${styles[activeTool]} ${styles.active} ${styles.button}`
                                            : styles.button
                                    }
                                    onClick={() => onSelectTool("image")}
                                >
                                    Image
                                </button>
                                <button
                                    className={
                                        activeTool === "component"
                                            ? `${styles[activeTool]} ${styles.active} ${styles.button}`
                                            : styles.button
                                    }
                                    onClick={() => onSelectTool("component")}
                                >
                                    Component
                                </button>
                                <button
                                    className={
                                        activeTool === "describe"
                                            ? `${styles[activeTool]} ${styles.active} ${styles.button}`
                                            : styles.button
                                    }
                                    onClick={() => onSelectTool("describe")}
                                >
                                    Describe
                                </button>
                            </>
                        )}
                        {activeTool && (
                            <h3 className={styles.toolTitle}>
                                {activeTool.toString().toUpperCase()}
                            </h3>
                        )}
                    </div>
                    <div className={styles.controlsContainer}>
                        {activeTool === "text" && (
                            <>
                                <div className={styles.controlContainer}>
                                    <button
                                        className={styles.button}
                                        onClick={() =>
                                            onSelectStyle({ variant: "title" })
                                        }
                                    >
                                        Title
                                    </button>
                                    <button
                                        className={styles.button}
                                        onClick={() =>
                                            onSelectStyle({
                                                variant: "subTitle",
                                            })
                                        }
                                    >
                                        Subtitle
                                    </button>
                                    <button
                                        className={styles.button}
                                        onClick={() =>
                                            onSelectStyle({
                                                variant: "heading",
                                            })
                                        }
                                    >
                                        Heading
                                    </button>
                                    <button
                                        className={styles.button}
                                        onClick={() =>
                                            onSelectStyle({
                                                variant: "subHeading",
                                            })
                                        }
                                    >
                                        Subheading
                                    </button>
                                    <button
                                        className={styles.button}
                                        onClick={() =>
                                            onSelectStyle({ variant: "body" })
                                        }
                                    >
                                        Body
                                    </button>
                                </div>
                                <div className={styles.controlContainer}>
                                    <button
                                        className={styles.button}
                                        onClick={() =>
                                            onSelectStyle({ align: "left" })
                                        }
                                    >
                                        Left
                                    </button>
                                    <button
                                        className={styles.button}
                                        onClick={() =>
                                            onSelectStyle({
                                                align: "right",
                                            })
                                        }
                                    >
                                        Right
                                    </button>
                                    <button
                                        className={styles.button}
                                        onClick={() =>
                                            onSelectStyle({
                                                align: "center",
                                            })
                                        }
                                    >
                                        Center
                                    </button>
                                    <button
                                        className={styles.button}
                                        onClick={() =>
                                            onSelectStyle({
                                                align: "justify",
                                            })
                                        }
                                    >
                                        Justify
                                    </button>
                                </div>
                            </>
                        )}
                        {activeTool && (
                            <button
                                className={styles.button}
                                onClick={() => onSaveElement(true)}
                            >
                                Save
                            </button>
                        )}
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
