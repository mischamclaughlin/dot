import { useState } from "react";

import type { AreaStyle, CanvasTool } from "./types/DotGridTypes";

import Canvas from "./Canvas";
import Sidebar from "./Sidebar";

import { defaultStyle } from "./styles/DotGridStyles";

import styles from "./DotGrid.module.css";

export const MAX_WIDTH_RATIO = 0.85;
export const MIN_WIDTH = 185;

type DotGridProps = {
    onNotifications: (isSaved: boolean) => void;
};

export default function DotGrid({ onNotifications }: DotGridProps) {
    const [activeTool, setActiveTool] = useState<CanvasTool>(null);

    const [activeStyle, setActiveStyle] = useState<AreaStyle>(defaultStyle);

    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [isGoBack, setIsGoBack] = useState<boolean>(false);

    function handleSelectTool(tool: CanvasTool) {
        setActiveTool(tool);
    }

    function handleSelectStyle(style: Partial<AreaStyle>) {
        setActiveStyle((prev) => ({ ...prev, ...style }));
    }

    function handleSaveElement(isSave: boolean) {
        setIsSaved(isSave);
        onNotifications(isSave);
    }

    function handleBack(isBack: boolean) {
        setIsGoBack(isBack);
    }

    return (
        <div className={styles.container}>
            <Sidebar
                activeTool={activeTool}
                activeStyle={activeStyle}
                onSelectTool={handleSelectTool}
                onSelectStyle={handleSelectStyle}
                onSaveItem={handleSaveElement}
                onGoBack={handleBack}
            />
            <Canvas
                activeTool={activeTool}
                activeStyle={activeStyle}
                isSaved={isSaved}
                isGoBack={isGoBack}
                onSelectTool={handleSelectTool}
                onSaveItem={handleSaveElement}
                onGoBack={handleBack}
            />
        </div>
    );
}
