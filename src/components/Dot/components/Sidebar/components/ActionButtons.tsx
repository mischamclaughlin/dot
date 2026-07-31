import type { ReactElement } from "react";

// import type { DraftTextElement } from "../../../model/DotDocument";
import type { DotStateProps } from "../../../state/DotStateProps";

import stylesBtn from "../styles/Button.module.css";
// -----------------------------------------------------------------------------

export default function ActionButtons({
    state,
    dispatch,
}: DotStateProps): ReactElement {
    // const element: DraftTextElement | null =
    //     state.canvasMode.mode === "editing"
    //         ? {
    //               toolType: "text",
    //               area: state.canvasMode.element.area,
    //               style: state.canvasMode.element.style,
    //               text: state.canvasMode.element.text,
    //           }
    //         : null;

    // function handleDispatchActionSave() {
    //     if (!element) return;

    //     dispatch({
    //         type: "action/save",
    //         payload: {
    //             id: crypto.randomUUID(),
    //             element: element,
    //         },
    //     });
    // }

    return (
        <div className={stylesBtn.buttonsContainer}>
            <button
                className={stylesBtn.btn}
                onClick={() =>
                    dispatch({
                        type: "action/back",
                    })
                }
            >
                back
            </button>
            <button
                className={stylesBtn.btn}
                onClick={() =>
                    dispatch({
                        type: "action/cancel",
                    })
                }
            >
                cancel
            </button>
            <button
                type="submit"
                form="text-edit-form"
                className={stylesBtn.btn}
                disabled={
                    state.canvasMode.mode !== "editing" ||
                    !state.canvasMode.element.area
                }
                // onClick={handleDispatchActionSave}
            >
                save
            </button>
        </div>
    );
}
