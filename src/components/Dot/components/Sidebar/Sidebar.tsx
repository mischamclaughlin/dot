import type { ReactElement } from "react";
import { useRef, useState } from "react";

import type { DotStateProps } from "../../state/DotStateProps";

import { dotConfig } from "../../dotConfig/DotConfig";

import ActionButtons from "./components/ActionButtons";
import DragBar from "./components/DragBar";
import FullscreenButton from "./components/FullscreenButtons";
import ToolSelectButtonsProps from "./components/ToolSelectButtons";

import styles from "./Sidebar.module.css";
import SelctedElementButtons from "./components/SelectedElementButtons";
// -----------------------------------------------------------------------------

export default function Sidebar({
    state,
    dispatch,
}: DotStateProps): ReactElement {
    const sideBarRef = useRef(null);

    const [isFullscreen, setIsFullscreen] = useState(false);

    const [width, setWidth] = useState<number>(dotConfig.minWidth);

    return (
        <>
            {!isFullscreen && (
                <div
                    className={styles.container}
                    style={{
                        minWidth: `${dotConfig.minWidth}px`,
                        width: `${width}px`,
                    }}
                    ref={sideBarRef}
                >
                    <div className={styles.sidebarContainer}>
                        <h1 className={styles.header}>Dot.</h1>
                        <h2 className={styles.headerTool}>
                            {state.toolType?.toUpperCase() ?? "TOOL"}
                        </h2>
                        <SelctedElementButtons
                            state={state}
                            dispatch={dispatch}
                        />
                        {!state.toolType && (
                            <ToolSelectButtonsProps
                                state={state}
                                dispatch={dispatch}
                            />
                        )}
                        {state.toolType && (
                            <ActionButtons state={state} dispatch={dispatch} />
                        )}
                    </div>

                    <DragBar onSetWidth={setWidth} />
                </div>
            )}
            <FullscreenButton
                width={width}
                onSetIsFullscreen={setIsFullscreen}
            />
        </>
    );
}
