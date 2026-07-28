import type { ReactElement } from "react";
// import { useReducer } from "react";

import Sidebar from "./components/Sidebar/Sidebar";

import styles from "./Dot.module.css";
import Canvas from "./components/Canvas/Canvas";
// -----------------------------------------------------------------------------

export const MAX_WIDTH_RATIO = 0.85;
export const MIN_WIDTH = 185;

export default function Dot(): ReactElement {
    // const [state, dispatch] = useReducer(squareDotReducer, initialState);

    return (
        <div className={styles.container}>
            {/* <Sidebar state={state} dispatch={dispatch} /> */}
            {/* <Canvas state={state} dispatch={dispatch} /> */}
            <Sidebar />
            <Canvas />
        </div>
    );
}
