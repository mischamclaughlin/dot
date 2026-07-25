import type { ReactElement } from "react";

import type { DotGridProps } from "../../types/DotGridProps";

import AlignButtons from "./component/TextToolButtons/AlignButtons";
import ColourPickerButtons from "./component/TextToolButtons/ColourPickerButtons";
import PaddingButtons from "./component/TextToolButtons/PaddingButtons";
import TextDisplayButtons from "./component/TextToolButtons/TextDisplayButtons";
// -----------------------------------------------------------------------------

export default function TextToolButtons({
    state,
    dispatch,
}: DotGridProps): ReactElement {
    return (
        <>
            <TextDisplayButtons state={state} dispatch={dispatch} />
            <AlignButtons state={state} dispatch={dispatch} />
            <PaddingButtons state={state} dispatch={dispatch} />
            <ColourPickerButtons state={state} dispatch={dispatch} />
        </>
    );
}
