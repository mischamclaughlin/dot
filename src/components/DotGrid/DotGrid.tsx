import { useState } from "react";

import type {
    AreaStyle,
    CanvasTool,
    Element,
    SelectionArea,
} from "./types/DotGridTypes";
import SideBar from "./SideBar";
import Canvas from "./Canvas";

import styles from "./DotGrid.module.css";

export const GRID_SIZE = 15;
export const MAX_WIDTH_RATIO = 0.85;

export default function DotGrid() {
    const [activeTool, setActiveTool] = useState<CanvasTool>(null);

    const [activeArea, setActiveArea] = useState<SelectionArea | null>(null);
    const [toolArea, setToolArea] = useState<SelectionArea | null>(null);

    const [activeStyle, setActiveStyle] = useState<AreaStyle | null>(null);

    const [elements, setElements] = useState<Element[] | null>(null);

    const [text, setText] = useState("");

    function handleSelectTool(tool: CanvasTool) {
        setActiveTool(tool);
        setToolArea(activeArea);
        setActiveArea(null);
    }

    function handleDeSelectTool() {
        setActiveTool(null);
        setActiveArea(toolArea);
        setToolArea(null);
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

        const element: Element = {
            text,
            style: activeStyle,
            area: toolArea,
        };

        setElements((current) => [...(current ?? []), element]);

        setText("");
        setActiveTool(null);
        setActiveArea(null);
        setToolArea(null);
    }

    function handleSetText(value: string) {
        setText(value);
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
                    activeArea={activeArea}
                    setActiveArea={setActiveArea}
                    toolArea={toolArea}
                    setToolArea={setToolArea}
                    onDeselectTool={handleDeSelectTool}
                    activeStyle={activeStyle}
                    elements={elements}
                    text={text}
                    onSetText={handleSetText}
                />
            </div>
        </>
    );
}
