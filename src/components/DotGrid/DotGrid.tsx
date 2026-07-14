import { useState } from "react";

import type { CanvasTool, SelectionArea } from "./types/DotGridTypes";
import SideBar from "./SideBar";
import Canvas from "./Canvas";

import styles from "./DotGrid.module.css";

export const GRID_SIZE = 15;
export const MAX_WIDTH_RATIO = 0.85;

export default function DotGrid() {
    const [activeTool, setActiveTool] = useState<CanvasTool>(null);
    const [activeArea, setActiveArea] = useState<SelectionArea | null>(null);
    const [toolArea, setToolArea] = useState<SelectionArea | null>(null);

    function handleSelectTool(tool: CanvasTool) {
        setActiveTool(tool);
        setToolArea(activeArea);
        setActiveArea(null);
    }

    return (
        <>
            <div className={styles.container}>
                <SideBar
                    activeTool={activeTool}
                    onSelectTool={handleSelectTool}
                />
                <Canvas
                    activeTool={activeTool}
                    activeArea={activeArea}
                    setActiveArea={setActiveArea}
                    toolArea={toolArea}
                />
            </div>
        </>
    );
}
