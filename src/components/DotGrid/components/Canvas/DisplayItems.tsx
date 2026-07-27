import type { Dispatch, ReactElement, RefObject } from "react";
import { Fragment } from "react";

import type { Action } from "../../state/DotGridReducer";
import type { AreaResize, CanvasItem } from "../../types/DotGridTypes";

import ResizeDragBox from "./components/ResizeDragBox";

import styles from "./DisplayItems.module.css";
// -----------------------------------------------------------------------------

type DisplayItemsProps = {
    canvasRef: RefObject<HTMLDivElement | null>;
    items: CanvasItem[];
    dispatch: Dispatch<Action>;
    onResizeArea: (distance: AreaResize | null) => void;
};

export default function DisplayItems({
    canvasRef,
    items,
    dispatch,
    onResizeArea,
}: DisplayItemsProps): ReactElement {
    return (
        <>
            {items.map((item) => (
                <Fragment key={item.id}>
                    <div
                        key={item.id}
                        className={styles.savedElement}
                        style={{ ...item.style, ...item.area }}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        {item.text}
                    </div>
                    <ResizeDragBox
                        canvasRef={canvasRef}
                        id={item.id}
                        area={item.area}
                        dispatch={dispatch}
                        onResizeArea={onResizeArea}
                    />
                </Fragment>
            ))}
        </>
    );
}
