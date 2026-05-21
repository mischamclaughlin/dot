import {
    PiChatTeardropTextThin,
    PiCheckThin,
    PiImageThin,
    PiNotePencilThin,
    PiPaintBucketThin,
    PiPuzzlePieceThin,
    PiTextAaThin,
    PiTextAlignCenterThin,
    PiTextAlignLeftThin,
    PiTextAlignRightThin,
    PiTextBThin,
    PiTextItalicThin,
} from "react-icons/pi";

import {
    type CSSProperties,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { dotGridTheme, cssVars } from "./dotGridTheme";
import type { Bounds, Cell } from "./dotGridGeometry";
import {
    getBounds,
    getOptionsRect,
    getSelectionRect,
    isInBounds,
} from "./dotGridGeometry";
import styles from "./DotGrid.module.css";

type BlockType = "text" | "image" | "component" | "describe";

type TextAlign = "left" | "center" | "right";

type TextBoxStyle = {
    textAlign: TextAlign;
    fontSize: number;
    fontWeight: 400 | 500 | 600 | 700 | 800 | 900;
    fontStyle: "normal" | "italic";
    color: string;
    lineHeight: number;
    letterSpacing: number;
    backgroundColor: string;
};

type Block = {
    id: string;
    type: "text";
    bounds: Bounds;
    text: string;
    style: TextBoxStyle;
};

const createDefaultTextBoxStyle = (): TextBoxStyle => ({
    textAlign: "left",
    fontSize: 16,
    fontWeight: 400,
    fontStyle: "normal",
    color: "#08060d",
    lineHeight: 1.4,
    letterSpacing: 0,
    backgroundColor: "#ffffff",
});

function getTextBoxCssProperties(style: TextBoxStyle): CSSProperties {
    return {
        textAlign: style.textAlign,
        fontSize: `${style.fontSize}px`,
        fontWeight: style.fontWeight,
        fontStyle: style.fontStyle,
        color: style.color,
        lineHeight: style.lineHeight,
        letterSpacing: `${style.letterSpacing}px`,
        backgroundColor: style.backgroundColor,
    };
}

export default function DotGrid() {
    const ref = useRef<HTMLDivElement | null>(null);
    const textEditorRef = useRef<HTMLDivElement | null>(null);

    const [rows, setRows] = useState<number>(0);
    const [cols, setCols] = useState<number>(0);
    const [firstCell, setFirstCell] = useState<Cell | null>(null);
    const [dragCell, setDragCell] = useState<Cell | null>(null);
    const [activeCells, setActiveCells] = useState<Bounds | null>(null);
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    const [text, setText] = useState<string>("");
    const [textStyle, setTextStyle] = useState<TextBoxStyle>(
        createDefaultTextBoxStyle,
    );
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

    useLayoutEffect(() => {
        if (blockType !== "text") return;

        const editor = textEditorRef.current;
        if (!editor) return;

        editor.textContent = "";
        editor.focus();

        const range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);

        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
    }, [blockType]);

    const selectionStyle = activeCells
        ? getSelectionRect(activeCells, {
              cellSize: dotGridTheme.cellSize,
              containerWidth: containerSize.width,
              containerHeight: containerSize.height,
              rows,
              cols,
          })
        : undefined;

    const textEditorStyle = selectionStyle
        ? {
              ...selectionStyle,
              ...getTextBoxCssProperties(textStyle),
          }
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

    const textControlsWidth = optionsStyle
        ? Math.min(containerSize.width, Math.max(optionsStyle.width, 240))
        : 0;

    const textControlsStyle = optionsStyle
        ? {
              ...optionsStyle,
              left: Math.max(
                  0,
                  Math.min(
                      optionsStyle.left,
                      containerSize.width - textControlsWidth,
                  ),
              ),
              width: textControlsWidth,
              height: "auto",
          }
        : undefined;

    function handleMouseDown(row: number, col: number) {
        const cell = { row, col };

        setFirstCell(cell);
        setDragCell(cell);
        setBlockType(null);
        setText("");
        setTextStyle(createDefaultTextBoxStyle());
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

        const currentText = textEditorRef.current?.innerText ?? text;
        const trimmedText = currentText.trim();

        if (trimmedText === "") {
            setText("");
            setTextStyle(createDefaultTextBoxStyle());
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
                style: { ...textStyle },
            },
        ]);

        setText("");
        setTextStyle(createDefaultTextBoxStyle());
        setBlockType(null);
        setActiveCells(null);
    }

    function updateTextStyle(style: Partial<TextBoxStyle>) {
        setTextStyle((currentStyle) => ({
            ...currentStyle,
            ...style,
        }));
    }

    function startTextBlock() {
        setText("");
        setTextStyle(createDefaultTextBoxStyle());
        setBlockType("text");
    }

    function getControlButtonClass(isActive = false) {
        return [
            styles.controlButton,
            isActive ? styles.activeControl : "",
        ].join(" ");
    }

    return (
        <>
            <div className={styles.pageContainer} style={cssVars} ref={ref}>
                {viewGrid()}

                {blocks.map((block) => (
                    <div
                        key={block.id}
                        className={styles.textBlock}
                        style={{
                            ...getSelectionRect(block.bounds, {
                                cellSize: dotGridTheme.cellSize,
                                containerWidth: containerSize.width,
                                containerHeight: containerSize.height,
                                rows,
                                cols,
                            }),
                            ...getTextBoxCssProperties(block.style),
                        }}
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
                                    onClick={startTextBlock}
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
                            <>
                                <div
                                    ref={textEditorRef}
                                    className={styles.textBox}
                                    style={textEditorStyle}
                                    contentEditable="plaintext-only"
                                    data-placeholder="Text"
                                    role="textbox"
                                    aria-multiline="true"
                                    suppressContentEditableWarning
                                    onInput={(e) =>
                                        setText(e.currentTarget.innerText)
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            (e.metaKey || e.ctrlKey) &&
                                            e.key === "Enter"
                                        ) {
                                            e.preventDefault();
                                            saveTextBlock();
                                        }
                                    }}
                                />
    
                                <div
                                    className={styles.textControls}
                                    style={textControlsStyle}
                                >
                                    <div className={styles.controlGroup}>
                                        <button
                                            className={getControlButtonClass(
                                                textStyle.textAlign === "left",
                                            )}
                                            type="button"
                                            title="Align left"
                                            aria-label="Align left"
                                            onMouseDown={(e) =>
                                                e.preventDefault()
                                            }
                                            onClick={() =>
                                                updateTextStyle({
                                                    textAlign: "left",
                                                })
                                            }
                                        >
                                            <PiTextAlignLeftThin />
                                        </button>
                                        <button
                                            className={getControlButtonClass(
                                                textStyle.textAlign ===
                                                    "center",
                                            )}
                                            type="button"
                                            title="Align center"
                                            aria-label="Align center"
                                            onMouseDown={(e) =>
                                                e.preventDefault()
                                            }
                                            onClick={() =>
                                                updateTextStyle({
                                                    textAlign: "center",
                                                })
                                            }
                                        >
                                            <PiTextAlignCenterThin />
                                        </button>
                                        <button
                                            className={getControlButtonClass(
                                                textStyle.textAlign === "right",
                                            )}
                                            type="button"
                                            title="Align right"
                                            aria-label="Align right"
                                            onMouseDown={(e) =>
                                                e.preventDefault()
                                            }
                                            onClick={() =>
                                                updateTextStyle({
                                                    textAlign: "right",
                                                })
                                            }
                                        >
                                            <PiTextAlignRightThin />
                                        </button>
                                    </div>

                                    <div className={styles.controlGroup}>
                                        <button
                                            className={getControlButtonClass(
                                                textStyle.fontWeight >= 700,
                                            )}
                                            type="button"
                                            title="Bold"
                                            aria-label="Bold"
                                            onMouseDown={(e) =>
                                                e.preventDefault()
                                            }
                                            onClick={() =>
                                                updateTextStyle({
                                                    fontWeight:
                                                        textStyle.fontWeight >=
                                                        700
                                                            ? 400
                                                            : 700,
                                                })
                                            }
                                        >
                                            <PiTextBThin />
                                        </button>
                                        <button
                                            className={getControlButtonClass(
                                                textStyle.fontStyle ===
                                                    "italic",
                                            )}
                                            type="button"
                                            title="Italic"
                                            aria-label="Italic"
                                            onMouseDown={(e) =>
                                                e.preventDefault()
                                            }
                                            onClick={() =>
                                                updateTextStyle({
                                                    fontStyle:
                                                        textStyle.fontStyle ===
                                                        "italic"
                                                            ? "normal"
                                                            : "italic",
                                                })
                                            }
                                        >
                                            <PiTextItalicThin />
                                        </button>
                                    </div>

                                    <label
                                        className={styles.controlField}
                                        title="Font size"
                                    >
                                        <PiTextAaThin />
                                        <input
                                            type="range"
                                            min="10"
                                            max="72"
                                            value={textStyle.fontSize}
                                            onChange={(e) =>
                                                updateTextStyle({
                                                    fontSize: Number(
                                                        e.target.value,
                                                    ),
                                                })
                                            }
                                        />
                                        <output>{textStyle.fontSize}</output>
                                    </label>

                                    <label
                                        className={styles.controlField}
                                        title="Line height"
                                    >
                                        <span>LH</span>
                                        <input
                                            type="range"
                                            min="0.8"
                                            max="2.4"
                                            step="0.1"
                                            value={textStyle.lineHeight}
                                            onChange={(e) =>
                                                updateTextStyle({
                                                    lineHeight: Number(
                                                        e.target.value,
                                                    ),
                                                })
                                            }
                                        />
                                        <output>
                                            {textStyle.lineHeight.toFixed(1)}
                                        </output>
                                    </label>

                                    <label
                                        className={styles.controlField}
                                        title="Letter spacing"
                                    >
                                        <span>LS</span>
                                        <input
                                            type="range"
                                            min="-2"
                                            max="8"
                                            step="0.5"
                                            value={textStyle.letterSpacing}
                                            onChange={(e) =>
                                                updateTextStyle({
                                                    letterSpacing: Number(
                                                        e.target.value,
                                                    ),
                                                })
                                            }
                                        />
                                        <output>
                                            {textStyle.letterSpacing}
                                        </output>
                                    </label>

                                    <div className={styles.controlGroup}>
                                        <label
                                            className={styles.colorControl}
                                            title="Text color"
                                            aria-label="Text color"
                                        >
                                            <PiTextAaThin />
                                            <input
                                                type="color"
                                                value={textStyle.color}
                                                onChange={(e) =>
                                                    updateTextStyle({
                                                        color: e.target.value,
                                                    })
                                                }
                                            />
                                        </label>
                                        <label
                                            className={styles.colorControl}
                                            title="Background color"
                                            aria-label="Background color"
                                        >
                                            <PiPaintBucketThin />
                                            <input
                                                type="color"
                                                value={
                                                    textStyle.backgroundColor
                                                }
                                                onChange={(e) =>
                                                    updateTextStyle({
                                                        backgroundColor:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </label>
                                        <button
                                            className={[
                                                styles.controlButton,
                                                styles.confirmButton,
                                            ].join(" ")}
                                            type="button"
                                            title="Save text"
                                            aria-label="Save text"
                                            onMouseDown={(e) =>
                                                e.preventDefault()
                                            }
                                            onClick={saveTextBlock}
                                        >
                                            <PiCheckThin />
                                        </button>
                                    </div>
                                </div>
                            </>
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
