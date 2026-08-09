import type { ReactElement } from "react";
import type { DotStateProps } from "../../../state/DotStateProps";

import stylesBtn from "../styles/Button.module.css";

export default function SelctedElementButtons({
    state,
    dispatch,
}: DotStateProps): ReactElement {
    const selectedElements = state.document.elements.filter(
        (el) => el.selected,
    );
    console.log(selectedElements);
    if (selectedElements.length <= 0) return <></>;

    return (
        <div className={stylesBtn.buttonsContainer}>
            <p>Selected</p>
            <button
                className={stylesBtn.btn}
                onClick={() =>
                    dispatch({
                        type: "action/cancel",
                    })
                }
            >
                clear
            </button>
            <button
                className={stylesBtn.btn}
                onClick={() =>
                    selectedElements.map((el) =>
                        dispatch({
                            type: "element/copy",
                            payload: { id: el.id, newId: crypto.randomUUID() },
                        }),
                    )
                }
            >
                copy
            </button>
            <button
                className={stylesBtn.btn}
                onClick={() =>
                    selectedElements.map((el) =>
                        dispatch({
                            type: "element/delete",
                            payload: el.id,
                        }),
                    )
                }
            >
                delete
            </button>
        </div>
    );
}
