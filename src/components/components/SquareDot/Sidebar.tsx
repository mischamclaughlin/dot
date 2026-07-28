import type { ReactElement } from "react";
import React, { useState } from "react";

import type { DotGridProps } from "./types/DotGridProps";

import { MAX_WIDTH_RATIO, MIN_WIDTH } from "../../SquareDot";

import { DotGridService } from "./services/DotGridService";

import ActionButtons from "./components/SidebarButtons/ActionButtons";
import FullscreenButtons from "./components/SidebarButtons/FullscreenButtons";
import TextToolButtons from "./components/SidebarButtons/TextToolButtons";
import ToolSelectorButtons from "./components/SidebarButtons/ToolSelectorButtons";

import styles from "./Sidebar.module.css";
// -----------------------------------------------------------------------------

const service = new DotGridService();

export default function Sidebar({
    state,
    dispatch,
}: DotGridProps): ReactElement {
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
        const maxWidth = Math.max(
            MIN_WIDTH,
            parentRect.width * MAX_WIDTH_RATIO,
        );
        const nextWidth = e.clientX - parentRect.left;

        const snappedWidth = service.snapToGrid(nextWidth, maxWidth);

        setWidth(Math.max(MIN_WIDTH, snappedWidth));
    }

    function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
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
                            {state.mode.kind !== "idle" &&
                            state.mode.kind !== "area-selected"
                                ? state.mode.draft.toolType.toUpperCase()
                                : "TOOLS"}
                        </h3>
                        {state.mode.kind !== "editing" && (
                            <ToolSelectorButtons
                                state={state}
                                dispatch={dispatch}
                            />
                        )}
                        {state.mode.kind !== "idle" &&
                            state.mode.kind !== "area-selected" && (
                                <>
                                    <ActionButtons
                                        state={state}
                                        dispatch={dispatch}
                                    />
                                    {state.mode.kind === "editing" && (
                                        <TextToolButtons
                                            state={state}
                                            dispatch={dispatch}
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
            <FullscreenButtons
                onToggleFullscreen={handleFullScreen}
                width={isFullscreen ? MIN_WIDTH : width}
            />
        </>
    );
}
