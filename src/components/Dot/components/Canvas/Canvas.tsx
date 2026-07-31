import type { ReactElement, CSSProperties } from "react";
import { Fragment, useEffect, useRef, useState } from "react";

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

        const session = state.canvasMode.session;

        dispatch({
            type: "action/save",
            payload: {
                id: session.editId ?? crypto.randomUUID(),
                element: session.element,
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

    const activeEditId =
        state.canvasMode.mode === "idle"
            ? null
            : state.canvasMode.session.editId;

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
                {state.canvasMode.mode === "drawing" &&
                    state.canvasMode.session.element.area && (
                        <>
                            <div
                                className={stylesArea.selectArea}
                                style={state.canvasMode.session.element.area}
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
                    state.canvasMode.session.element.area && (
                        <>
                            <form id="text-edit-form" onSubmit={handleSave}>
                                <textarea
                                    className={stylesArea.editArea}
                                    style={{
                                        ...styleCSS(
                                            state.canvasMode.session.element
                                                .style,
                                        ),
                                        ...state.canvasMode.session.element
                                            .area,
                                    }}
                                    name="text"
                                    value={
                                        state.canvasMode.session.element.text
                                    }
                                    onChange={(e) =>
                                        dispatch({
                                            type: "draft/textChanged",
                                            payload: e.target.value,
                                        })
                                    }
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
                {state.document.elements
                    .filter((element) => element.id !== activeEditId)
                    .map((element) => (
                    <Fragment key={element.id}>
                        <div
                            className={stylesArea.savedElement}
                            style={{
                                ...styleCSS(element.style),
                                ...element.area,
                            }}
                        >
                            {element.text}
                        </div>
                        <button
                            className={stylesArea.editBtn}
                            style={{
                                left: element.area.left + 4,
                                top:
                                    element.area.top +
                                    element.area.height -
                                    4,
                                transform: "translateY(-100%)",
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() =>
                                dispatch({
                                    type: "canvasMode/editElement",
                                    payload: element.id,
                                })
                            }
                        >
                            edit
                        </button>
                    </Fragment>
                ))}
            </div>
        </>
    );
}
