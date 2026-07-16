import { useState } from "react";

import type { AreaStyle, CanvasTool } from "./types/DotGridTypes";

import Canvas from "./Canvas";
import SideBar from "./SideBar";

import styles from "./DotGrid.module.css";

export const GRID_SIZE = 15;
export const MAX_WIDTH_RATIO = 0.85;

export default function DotGrid() {
    const [activeTool, setActiveTool] = useState<CanvasTool>(null);

    const [activeStyle, setActiveStyle] = useState<AreaStyle | null>(null);

    const [isSaved, setIsSaved] = useState<boolean>(false);

    function handleSelectTool(tool: CanvasTool) {
        setActiveTool(tool);
    }

    function handleDeSelectTool() {
        setActiveTool(null);
    }

    function handleSelectStyle(style: Partial<AreaStyle>) {
        const defaultStyle: AreaStyle = {
            variant: "body",
            align: "left",
        };

        setActiveStyle((prev) => ({
            ...(prev ?? defaultStyle),
            ...style,
        }));
    }
    function handleSaveElement(isSave: boolean) {
        if (!isSave) return;

        setIsSaved(true);
    }

    function handleSavedElement(isSaved: boolean) {
        if (isSaved) return;

        setIsSaved(false);
    }

    return (
        <>
            <div className={styles.container}>
                <SideBar
                    activeTool={activeTool}
                    onSelectTool={handleSelectTool}
                    onSelectStyle={handleSelectStyle}
                    onSaveElement={handleSaveElement}
                />
                <Canvas
                    activeTool={activeTool}
                    onDeselectTool={handleDeSelectTool}
                    activeStyle={activeStyle}
                    isSaved={isSaved}
                    onSavedElement={handleSavedElement}
                />
            </div>
        </>
    );
}
