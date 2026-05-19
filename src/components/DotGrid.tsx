import { PiNotePencilThin } from "react-icons/pi";
import { PiImageThin } from "react-icons/pi";
import { PiPuzzlePieceThin } from "react-icons/pi";
import { PiChatTeardropTextThin } from "react-icons/pi";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { dotGridTheme, cssVars } from "./dotGridTheme";
import type { Bounds, Cell } from "./dotGridGeometry";
import { getBounds, getOptionsRect, getSelectionRect, isInBounds } from "./dotGridGeometry";
import styles from "./DotGrid.module.css";

type BlockType = "text" | "image" | "component" | "describe";

type Block = {
    id: string;
    type: BlockType;
    bounds: Bounds;
    text?: string;
};

export default function DotGrid() {
    const ref = useRef<HTMLDivElement | null>(null);

    const [rows, setRows] = useState<number>(0);
    const [cols, setCols] = useState<number>(0);
    const [firstCell, setFirstCell] = useState<Cell | null>(null);
    const [dragCell, setDragCell] = useState<Cell | null>(null);
    const [activeCells, setActiveCells] = useState<Bounds | null>(null);
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    const [text, setText] = useState<string>("");
    const [blockType, setBlockType] = useState<BlockType | null>(null);
    const [blocks, setBlocks] = useState<Block[]>([]);

    const previewCells = useMemo(() => {
        if (!isMouseDown || firstCell === null || dragCell === null)
            return activeCells;

        return getBounds(firstCell, dragCell);
    }, [isMouseDown, firstCell, dragCell, activeCells]);

    useLayoutEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;

            setContainerSize({ width, height });
            setRows(Math.floor(height / dotGridTheme.cellSize));
            setCols(Math.floor(width / dotGridTheme.cellSize));
        });

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    const selectionStyle = activeCells
        ? getSelectionRect(activeCells, {
              cellSize: dotGridTheme.cellSize,
              containerWidth: containerSize.width,
              containerHeight: containerSize.height,
              rows,
              cols,
          })
        : undefined;

    const optionsStyle = activeCells
        ? getOptionsRect(activeCells, {
              cellSize: dotGridTheme.cellSize,
              containerWidth: containerSize.width,
              containerHeight: containerSize.height,
              rows,
              cols,
          })
        : undefined;

    function handleMouseDown(row: number, col: number) {
        const cell = { row, col };

        setFirstCell(cell);
        setDragCell(cell);
        setBlockType(null);
        setText("");
        setIsMouseDown(true);
    }

    function handleMouseEnter(row: number, col: number) {
        if (!isMouseDown) return;

        setDragCell({ row, col });
    }

    function handleMouseUp(row: number, col: number) {
        if (firstCell !== null)
            setActiveCells(getBounds(firstCell, { row, col }));

        setIsMouseDown(false);
        setDragCell(null);
    }

    function viewGrid() {
        return Array.from({ length: rows }).map((_, row) => (
            <div className={styles.row} key={`${row}`}>
                {Array.from({ length: cols }).map((_, col) => {
                    const cellId = `${row}-${col}`;

                    return (
                        <div
                            className={[
                                styles.cell,
                                isInBounds(row, col, previewCells)
                                    ? styles.activeCell
                                    : "",
                            ].join(" ")}
                            key={cellId}
                            onMouseDown={() => handleMouseDown(row, col)}
                            onMouseEnter={() => handleMouseEnter(row, col)}
                            onMouseUp={() => handleMouseUp(row, col)}
                        >
                            <div className={styles.dot} />
                        </div>
                    );
                })}
            </div>
        ));
    }

    function saveTextBlock() {
        if (!activeCells) return;

        const trimmedText = text.trim();

        if (trimmedText === "") {
            setText("");
            setBlockType(null);
            setActiveCells(null);
            return;
        }

        setBlocks((blocks) => [
            ...blocks,
            {
                id: crypto.randomUUID(),
                type: "text",
                bounds: activeCells,
                text: trimmedText,
            },
        ]);

        setText("");
        setBlockType(null);
        setActiveCells(null);
    }

    return (
        <>
            <div className={styles.pageContainer} style={cssVars} ref={ref}>
                {viewGrid()}

                {blocks.map((block) => (
                    <div
                        key={block.id}
                        className={styles.textBlock}
                        style={getSelectionRect(block.bounds, {
                            cellSize: dotGridTheme.cellSize,
                            containerWidth: containerSize.width,
                            containerHeight: containerSize.height,
                            rows,
                            cols,
                        })}
                    >
                        <p>{block.text}</p>
                    </div>
                ))}

                {activeCells && (
                    <>
                        {activeCells && blockType === null && (
                            <div
                                className={styles.blockChoice}
                                style={optionsStyle}
                            >
                                <button
                                    className={styles.choiceBtn}
                                    type="button"
                                    onClick={() => setBlockType("text")}
                                >
                                    <PiNotePencilThin className={styles.icon} />
                                </button>
                                <button
                                    className={styles.choiceBtn}
                                    type="button"
                                    onClick={() => setBlockType("image")}
                                >
                                    <PiImageThin className={styles.icon} />
                                </button>
                                <button
                                    className={styles.choiceBtn}
                                    type="button"
                                    onClick={() => setBlockType("component")}
                                >
                                    <PiPuzzlePieceThin
                                        className={styles.icon}
                                    />
                                </button>
                                <button
                                    className={styles.choiceBtn}
                                    type="button"
                                    onClick={() => setBlockType("describe")}
                                >
                                    <PiChatTeardropTextThin
                                        className={styles.icon}
                                    />
                                </button>
                            </div>
                        )}

                        {activeCells && blockType === "text" && (
                            <input
                                className={styles.textBox}
                                style={selectionStyle}
                                autoFocus
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onBlur={saveTextBlock}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        saveTextBlock();
                                    }
                                }}
                            />
                        )}

                        {activeCells && blockType === "image" && (
                            <div
                                className={styles.imageBlock}
                                style={selectionStyle}
                            >
                                image block
                            </div>
                        )}

                        {activeCells && blockType === "component" && (
                            <div
                                className={styles.componentBlock}
                                style={selectionStyle}
                            >
                                component block
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
