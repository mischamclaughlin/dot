import React, { type ReactElement, useState } from "react";

import type { AreaStyle, CanvasTool } from "./types/DotGridTypes";

import { MAX_WIDTH_RATIO, MIN_WIDTH } from "./DotGrid";

import styles from "./Sidebar.module.css";

import TextToolControls from "./components/SidebarControls/TextToolControls";
import ToolSelectors from "./components/SidebarControls/ToolSelectors";
import FullscreenToolControls from "./components/SidebarControls/FullscreenToolControls";
import ToolActions from "./components/SidebarControls/ToolActions";
import { DotGridService } from "./services/DotGridService";

type SidebarProps = {
    activeTool: CanvasTool;
    activeStyle: AreaStyle;
    isSaveable: boolean;
    onSelectTool: (tool: CanvasTool) => void;
    onSelectStyle: (style: Partial<AreaStyle>) => void;
    onSaveItem: (isSave: boolean) => void;
    onGoBack: (isBack: boolean) => void;
};

export default function Sidebar({
    activeTool,
    activeStyle,
    isSaveable,
    onSelectTool,
    onSelectStyle,
    onSaveItem,
    onGoBack,
}: SidebarProps): ReactElement {
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

        const service = new DotGridService();
        const currWidth = service.snapToGrid(nextWidth, maxWidth);
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
                    <div className={styles.sidebarContainer}>
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
                                    isSaveable={isSaveable}
                                    onGoBack={onGoBack}
                                    onSaveItem={onSaveItem}
                                />
                                {activeTool === "text" && (
                                    <TextToolControls
                                        activeStyle={activeStyle}
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
                width={isFullscreen ? MIN_WIDTH : width}
            />
        </>
    );
}
