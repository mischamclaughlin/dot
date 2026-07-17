import { useState } from "react";

import type { AreaStyle, CanvasTool } from "./types/DotGridTypes";

import Canvas from "./Canvas";
import SideBar from "./SideBar";

import styles from "./DotGrid.module.css";
import {
    defaultBackgroundColour,
    defaultContentAlign,
    defaultForegroundColour,
} from "./styles/DotGridStyles";

export const MAX_WIDTH_RATIO = 0.85;
export const MIN_WIDTH = 185

export default function DotGrid() {
    const [activeTool, setActiveTool] = useState<CanvasTool>(null);

    const [activeStyle, setActiveStyle] = useState<AreaStyle | null>(null);

    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [isGoBack, setIsGoBack] = useState<boolean>(false);

    function handleSelectTool(tool: CanvasTool) {
        setActiveTool(tool);
    }

    function handleSelectStyle(style: Partial<AreaStyle>) {
        const defaultStyle: AreaStyle = {
            variant: "body",
            textAlign: "left",
            contentAlign: defaultContentAlign,
            foregroundColour: defaultForegroundColour,
            backgroundColour: defaultBackgroundColour,
        };

        setActiveStyle((prev) => ({
            ...(prev ?? defaultStyle),
            ...style,
        }));
    }

    function handleSaveElement(isSave: boolean) {
        setIsSaved(isSave);
    }

    function handleBack(isBack: boolean) {
        setIsGoBack(isBack);
    }

    return (
        <>
            <div className={styles.container}>
                <SideBar
                    activeTool={activeTool}
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
        </>
    );
}
