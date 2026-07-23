import type { Dispatch, ReactElement } from "react";
import React, { useState } from "react";

import { MAX_WIDTH_RATIO, MIN_WIDTH } from "./DotGrid";

import type { Action, State } from "./state/DotGridReducer";

import { DotGridService } from "./services/DotGridService";

import FullscreenToolControls from "./components/SidebarControls/FullscreenToolControls";
import TextToolControls from "./components/SidebarControls/TextToolControls";
import ToolActions from "./components/SidebarControls/ToolActions";
import ToolSelectors from "./components/SidebarControls/ToolSelectors";

import styles from "./Sidebar.module.css";

const service = new DotGridService();

type SidebarProps = {
    state: State;
    dispatch: Dispatch<Action>;
};

export default function Sidebar({
    state,
    dispatch,
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
                            {state.tool ? state.tool.toUpperCase() : "TOOLS"}
                        </h3>
                        {!state.tool && <ToolSelectors dispatch={dispatch} />}
                        {state.tool && (
                            <>
                                <ToolActions
                                    state={state}
                                    dispatch={dispatch}
                                />
                                {state.tool === "text" && (
                                    <TextToolControls
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
            <FullscreenToolControls
                onToggleFullscreen={handleFullScreen}
                width={isFullscreen ? MIN_WIDTH : width}
            />
        </>
    );
}
