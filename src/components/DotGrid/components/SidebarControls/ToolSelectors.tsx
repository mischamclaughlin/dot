import type { ReactElement } from "react";

import styles from "./ToolSelectors.module.css";
import type { CanvasTool } from "../../types/DotGridTypes";

type ToolSelectorsProps = {
    onSelectTool: (tool: CanvasTool) => void;
};

export default function ToolSelectors({
    onSelectTool,
}: ToolSelectorsProps): ReactElement {
    return (
        <div className={styles.controlContainer}>
            <button
                className={styles.button}
                onClick={() => onSelectTool("text")}
            >
                Text
            </button>
            <button
                className={styles.button}
                onClick={() => onSelectTool("image")}
            >
                Image
            </button>
            <button
                className={styles.button}
                onClick={() => onSelectTool("component")}
            >
                Component
            </button>
            <button
                className={styles.button}
                onClick={() => onSelectTool("describe")}
            >
                Describe
            </button>
        </div>
    );
}
