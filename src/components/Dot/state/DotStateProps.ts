import type { Dispatch } from "react";

import type { DotState } from "../model/DotDocumentState";
import type { Action } from "./DotReducer";

export type DotStateProps = {
    state: DotState;
    dispatch: Dispatch<Action>;
};
