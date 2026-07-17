import React, { type ReactElement, useState } from "react";

import type { AreaStyle, CanvasTool } from "./types/DotGridTypes";

import { MAX_WIDTH_RATIO, MIN_WIDTH } from "./DotGrid";

import styles from "./SideBar.module.css";

import TextToolControls from "./components/ToolControls/TextToolControls";
import ToolSelectors from "./components/ToolControls/ToolSelectors";
import FullscreenToolControls from "./components/ToolControls/FullscreenToolControls";
import ToolActions from "./components/ToolControls/ToolActions";

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
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

    const [width, setWidth] = useState<number>(MIN_WIDTH);

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

        const currWidth = Math.max(0, Math.min(nextWidth, maxWidth));
        setWidth(currWidth);
    }

    function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
        e.currentTarget.releasePointerCapture(e.pointerId);
        setIsDragging(false);
    }

    function handleFullScreen() {
        setIsFullscreen((current) => !current);
    }

    return (
        <>
            {!isFullscreen && (
                <div
                    className={styles.container}
                    style={{ width: `${width}px`, minWidth: `${MIN_WIDTH}px` }}
                >
                    <div className={styles.sideBarContainer}>
                        <h1 className={styles.title}>Dot.</h1>
                        <h3 className={styles.toolTitle}>
                            {activeTool ? activeTool.toUpperCase() : "TOOLS"}
                        </h3>
                        {!activeTool && (
                            <ToolSelectors onSelectTool={onSelectTool} />
                        )}
                        {activeTool && (
                            <>
                                <ToolActions
                                    onGoBack={onGoBack}
                                    onSaveItem={onSaveItem}
                                />
                                {activeTool === "text" && (
                                    <TextToolControls
                                        onSelectStyle={onSelectStyle}
                                    />
                                )}
                            </>
                        )}
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
            )}
            <FullscreenToolControls
                onToggleFullscreen={handleFullScreen}
                width={width}
            />
        </>
    );
}
