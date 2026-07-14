import { useState } from "react";

import Canvas from "./Canvas";
import SideBar from "./SideBar";

import styles from "./DotGrid.module.css";

export type CanvasTool = "text" | "image" | "component" | "describe" | null;

export default function DotGrid() {
    const [activeTool, setActiveTool] = useState<CanvasTool>(null);

    return (
        <>
            <div className={styles.container}>
                <SideBar activeTool={activeTool} onSelectTool={setActiveTool} />
                <Canvas activeTool={activeTool} />
            </div>
        </>
    );
}
