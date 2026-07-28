import type { Dispatch, ReactElement, RefObject } from "react";
import { Fragment } from "react";

import type { Action } from "../../state/SquareDotReducer";

import ResizeDragBox from "./components/ResizeDragBox";

import styles from "./DisplayItems.module.css";
import type { SquareDotItem } from "../../../../model/SquareDotDocument";
import type { AreaResize } from "../../types/DotGridTypes";
// -----------------------------------------------------------------------------

type DisplayItemsProps = {
    canvasRef: RefObject<HTMLDivElement | null>;
    items: SquareDotItem[];
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
                        onPointerDown={(e) => e.stopPropagation()}
                        className={styles.savedElement}
                        style={{
                            alignContent: item.style.alignContent,
                            textAlign: item.style.alignText,
                            backgroundColor: item.style.colourBackground,
                            color: item.style.colourForeground,
                            fontSize: `${item.style.fontSize}rem`,
                            fontWeight: item.style.fontWeight,
                            paddingTop: `${item.style.paddingTop}px`,
                            paddingRight: `${item.style.paddingRight}px`,
                            paddingBottom: `${item.style.paddingBottom}px`,
                            paddingLeft: `${item.style.paddingLeft}px`,
                            ...item.area,
                        }}
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
