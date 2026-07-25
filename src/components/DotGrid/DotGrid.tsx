import type { ReactElement } from "react";
import { useEffect, useReducer } from "react";

import { dotGridReducer, initialState } from "./state/DotGridReducer";

import Canvas from "./Canvas";
import Sidebar from "./Sidebar";

import styles from "./DotGrid.module.css";
// -----------------------------------------------------------------------------

export const MAX_WIDTH_RATIO = 0.85;
export const MIN_WIDTH = 185;

type DotGridProps = {
    onNotifications: (isSaved: string | null) => void;
};

export default function DotGrid({
    onNotifications,
}: DotGridProps): ReactElement {
    const [state, dispatch] = useReducer(dotGridReducer, initialState);

    useEffect(() => {
        onNotifications(state.lastSavedItemId);
    }, [state.lastSavedItemId, onNotifications]);

    return (
        <div className={styles.container}>
            <Sidebar state={state} dispatch={dispatch} />
            <Canvas state={state} dispatch={dispatch} />
        </div>
    );
}
