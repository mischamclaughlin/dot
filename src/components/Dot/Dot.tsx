import type { CSSProperties, ReactElement } from "react";
import { useReducer } from "react";

import { dotConfig } from "./dotConfig/DotConfig";
import { initialState } from "./state/DotInitialState";
import { dotReducer } from "./state/DotReducer";

import Canvas from "./components/Canvas/Canvas";
import Sidebar from "./components/Sidebar/Sidebar";

import styles from "./Dot.module.css";
// -----------------------------------------------------------------------------

export default function Dot(): ReactElement {
    const [state, dispatch] = useReducer(dotReducer, initialState);

    return (
        <div
            className={styles.container}
            style={
                {
                    "--grid-spacing": `${dotConfig.gridSpacing}px`,
                    "--grid-spacing-half": `${dotConfig.gridSpacing / 2}px`,
                    "--dot-size": `${dotConfig.dotSize}px`,
                    "--hover-dot-size": `${dotConfig.hoverDotSize}px`,
                } as CSSProperties
            }
        >
            <Sidebar state={state} dispatch={dispatch} />
            <Canvas state={state} dispatch={dispatch} />
        </div>
    );
}
