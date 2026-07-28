import type { ReactElement } from "react";
import { useReducer } from "react";

import {
    squareDotReducer,
    initialState,
} from "./components/SquareDot/state/SquareDotReducer";

import Canvas from "./components/SquareDot/Canvas";
import Sidebar from "./components/SquareDot/Sidebar";

import styles from "./SquareDot.module.css";
// -----------------------------------------------------------------------------

export const MAX_WIDTH_RATIO = 0.85;
export const MIN_WIDTH = 185;

// type DotGridProps = {
//     onNotifications: (isSaved: string | null) => void;
// };

// export default function DotGrid({
//     onNotifications,
// }: DotGridProps): ReactElement {

export default function DotGrid(): ReactElement {
    const [state, dispatch] = useReducer(squareDotReducer, initialState);

    // useEffect(() => {
    //     onNotifications(state.lastSavedItemId);
    // }, [state.lastSavedItemId, onNotifications]);

    return (
        <div className={styles.container}>
            <Sidebar state={state} dispatch={dispatch} />
            <Canvas state={state} dispatch={dispatch} />
        </div>
    );
}
