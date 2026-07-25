import type { Dispatch } from "react";
import type { Action, State } from "../state/DotGridReducer";

export type DotGridProps = {
    state: State;
    dispatch: Dispatch<Action>;
};
