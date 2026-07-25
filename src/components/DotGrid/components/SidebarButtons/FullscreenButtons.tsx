import type { ReactElement } from "react";

import { MIN_WIDTH } from "../../DotGrid";

import styles from "./FullscreenButtons.module.css";
// -----------------------------------------------------------------------------

type FullscreenToolControlsProps = {
    onToggleFullscreen: () => void;
    width: number;
};

export default function FullscreenButtons({
    onToggleFullscreen,
    width,
}: FullscreenToolControlsProps): ReactElement {
    return (
        <div className={styles.fullscreenContainer}>
            <button
                className={styles.button}
                onClick={onToggleFullscreen}
                style={{
                    width: `${width - 20}px`,
                    minWidth: `${MIN_WIDTH - 20}px`,
                }}
            >
                Fullscreen
            </button>
        </div>
    );
}
