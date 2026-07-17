import React, { type CSSProperties, type ReactElement, useState } from "react";

import type { AreaStyle, CanvasTool } from "./types/DotGridTypes";

import { MAX_WIDTH_RATIO, MIN_WIDTH } from "./DotGrid";

import styles from "./SideBar.module.css";
import {
    defaultBackgroundColour,
    defaultForegroundColour,
} from "./styles/DotGridStyles";

type SideBarProps = {
    activeTool: CanvasTool;
    onSelectTool: (tool: CanvasTool) => void;
    onSelectStyle: (style: AreaStyle) => void;
    onSaveItem: (isSave: boolean) => void;
    onGoBack: (isBack: boolean) => void;
};

export default function SideBar({
    activeTool,
    onSelectTool,
    onSelectStyle,
    onSaveItem,
    onGoBack,
}: SideBarProps): ReactElement {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [width, setWidth] = useState<number>(MIN_WIDTH);

    const [backgroundColour, setBackgroundColour] = useState<CSSProperties>(
        defaultBackgroundColour,
    );
    const [foregroundColour, setForegroundColour] = useState<CSSProperties>(
        defaultForegroundColour,
    );

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
            <div
                className={styles.container}
                style={{ width: `${width}px`, minWidth: `${MIN_WIDTH}px` }}
            >
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
                                            onSelectStyle({ textAlign: "left" })
                                        }
                                    >
                                        Left
                                    </button>
                                    <button
                                        className={styles.button}
                                        onClick={() =>
                                            onSelectStyle({
                                                textAlign: "right",
                                            })
                                        }
                                    >
                                        Right
                                    </button>
                                    <button
                                        className={styles.button}
                                        onClick={() =>
                                            onSelectStyle({
                                                textAlign: "center",
                                            })
                                        }
                                    >
                                        Center
                                    </button>
                                    <button
                                        className={styles.button}
                                        onClick={() =>
                                            onSelectStyle({
                                                textAlign: "justify",
                                            })
                                        }
                                    >
                                        Justify
                                    </button>
                                </div>
                                <div className={styles.controlContainer}>
                                    <div className={styles.colourPicker}>
                                        <label
                                            className={styles.button}
                                            htmlFor="foregroundColour"
                                        >
                                            Foreground
                                        </label>
                                        <input
                                            type="color"
                                            id="foregroundColour"
                                            name="foregroundColour"
                                            value={foregroundColour.color}
                                            onChange={(e) => {
                                                setForegroundColour({
                                                    color: e.target.value,
                                                });
                                                onSelectStyle({
                                                    foregroundColour:
                                                        foregroundColour,
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className={styles.colourPicker}>
                                        <label
                                            className={styles.button}
                                            htmlFor="backgroundColour"
                                        >
                                            Background
                                        </label>
                                        <input
                                            type="color"
                                            id="backgroundColour"
                                            name="backgroundColour"
                                            value={
                                                backgroundColour.backgroundColor
                                            }
                                            onChange={(e) => {
                                                setBackgroundColour({
                                                    backgroundColor:
                                                        e.target.value,
                                                });
                                                onSelectStyle({
                                                    backgroundColour:
                                                        backgroundColour,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        {activeTool && (
                            <div className={styles.controlContainer}>
                                <button
                                    className={styles.button}
                                    onClick={() => onGoBack(true)}
                                >
                                    Back
                                </button>
                                <button
                                    className={styles.button}
                                    onClick={() => onSaveItem(true)}
                                >
                                    Save
                                </button>
                            </div>
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
