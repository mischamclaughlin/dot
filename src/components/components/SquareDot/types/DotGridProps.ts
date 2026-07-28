import type { Dispatch } from "react";

import type { Action } from "../state/SquareDotReducer";
import type { SquareDotState } from "../state/types/StateTypes";
// -----------------------------------------------------------------------------

export type DotGridProps = {
    state: SquareDotState;
    dispatch: Dispatch<Action>;
};
