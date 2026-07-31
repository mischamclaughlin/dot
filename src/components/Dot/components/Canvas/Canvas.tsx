import type { ReactElement, CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

import type { Rect, TextStyle } from "../../model/DotDocument";
import type { DotStateProps } from "../../state/DotStateProps";
import type { SingleDot } from "../../types/DotTypes";

import { dotConfig } from "../../dotConfig/DotConfig";
import { DotGeometryService } from "../../services/DotGeometryService";

import DragBox from "./components/DragBox";

import styles from "./Canvas.module.css";
import stylesArea from "./styles/Area.module.css";
// -----------------------------------------------------------------------------

const geo = new DotGeometryService(dotConfig.gridSpacing);

export default function Canvas({
    state,
    dispatch,
}: DotStateProps): ReactElement {
    const canvasRef = useRef(null);

    const [hoverDot, setHoverDot] = useState<SingleDot | null>(null);
    const [startDot, setStartDot] = useState<SingleDot | null>(null);

    const [tempArea, setTempArea] = useState<Rect | null>(null);

    useEffect(() => {
        function handleWindowKeyDown(e: KeyboardEvent) {
            if (e.key !== "Escape") return;

            setTempArea(null);
            setStartDot(null);
            dispatch({ type: "action/cancel" });
        }

        window.addEventListener("keydown", handleWindowKeyDown);

        return () => window.removeEventListener("keydown", handleWindowKeyDown);
    }, [dispatch]);

    function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
        const start = geo.getCanvasDot(e, canvasRef);
        setStartDot(start);
    }

    function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
        const current = geo.getCanvasDot(e, canvasRef);
        if (!current) return;

        setHoverDot(current);

        if (!startDot) return;
        if (geo.isSameDot(startDot, current)) return;

        const area = geo.updateTempArea(startDot, current);
        setTempArea(area);
    }

    function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
        const tempStartDot = startDot;

        setStartDot(null);

        const end = geo.getCanvasDot(e, canvasRef);
        if (!end) return;

        if (!tempStartDot) return;
        if (geo.isSameDot(tempStartDot, end)) return;

        const area = geo.updateTempArea(tempStartDot, end);

        setTempArea(null);

        dispatch({
            type: "canvasMode/switch",
            payload: {
                toolType: state.toolType,
                area: area,
            },
        });
    }

    function handleSave(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (state.canvasMode.mode !== "editing") return;

        const text = new FormData(e.currentTarget).get("text");

        dispatch({
            type: "action/save",
            payload: {
                id: crypto.randomUUID(),
                element: {
                    toolType: "text",
                    area: state.canvasMode.element.area,
                    style: state.canvasMode.element.style,
                    text: typeof text === "string" ? text : "",
                },
            },
        });
    }

    function styleCSS(element?: TextStyle) {
        if (!element) return undefined;

        return {
            alignContent: element.alignContent,
            textAlign: element.alignText,
            backgroundColor: element.colourBackground,
            color: element.colourForeground,
            fontSize: `${element.fontSize}rem`,
            fontWeight: element.fontWeight,
            paddingTop: `${element.paddingTop}px`,
            paddingRight: `${element.paddingRight}px`,
            paddingBottom: `${element.paddingBottom}px`,
            paddingLeft: `${element.paddingLeft}px`,
        } satisfies CSSProperties;
    }

    return (
        <>
            <div
                className={`
                        ${styles.container}
                        ${
                            state.canvasMode.mode === "editing"
                                ? styles.canvasEdit
                                : styles.canvas
                        }
                    `}
                style={{
                    backgroundSize: `${geo.gridSize}px ${geo.gridSize}px`,
                }}
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                {hoverDot && (
                    <div
                        className={styles.hoverDot}
                        style={{ left: hoverDot.x, top: hoverDot.y }}
                    />
                )}
                {tempArea && (
                    <div
                        className={stylesArea.tempArea}
                        style={{
                            left: tempArea.left,
                            width: tempArea.width,
                            top: tempArea.top,
                            height: tempArea.height,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                        }}
                    />
                )}
                {state.canvasMode.mode === "drawing" && (
                    <>
                        <div
                            className={stylesArea.selectArea}
                            style={{
                                left: state.canvasMode.area.left,
                                width: state.canvasMode.area.width,
                                top: state.canvasMode.area.top,
                                height: state.canvasMode.area.height,
                            }}
                            onPointerDown={(e) => {
                                e.stopPropagation();
                            }}
                        />
                        <DragBox
                            state={state}
                            dispatch={dispatch}
                            canvasRef={canvasRef}
                        />
                    </>
                )}
                {state.canvasMode.mode === "editing" &&
                    state.canvasMode.element.area && (
                        <>
                            <form id="text-edit-form" onSubmit={handleSave}>
                                <textarea
                                    className={stylesArea.editArea}
                                    style={{
                                        ...styleCSS(
                                            state.canvasMode.element.style,
                                        ),
                                        ...state.canvasMode.element.area,
                                    }}
                                    name="text"
                                    defaultValue={state.canvasMode.element.text}
                                    onPointerDown={(e) => {
                                        e.stopPropagation();
                                    }}
                                />
                            </form>
                            <DragBox
                                state={state}
                                dispatch={dispatch}
                                canvasRef={canvasRef}
                            />
                        </>
                    )}
                {state.document.elements.map((element) => (
                    <div
                        key={element.id}
                        className={stylesArea.savedElements}
                        style={{
                            ...styleCSS(element.style),
                            ...element.area,
                        }}
                    >
                        {element.text}
                        <button
                            className={styles.editBtn}
                            onClick={() =>
                                dispatch({
                                    type: "canvasMode/editElement",
                                    payload: element.id,
                                })
                            }
                        >
                            edit
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
}
