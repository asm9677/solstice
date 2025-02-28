"use client";

import React, { useRef, useState } from "react";
import { Stage, Layer, Rect, Transformer, Group, Line as KonvaLine, Text as KonvaText } from "react-konva";

export const Canvas = () => {
    const [lines, setLines] = useState([]);
    const [texts, setTexts] = useState([]);
    const [rects, setRects] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [editingText, setEditingText] = useState(null);
    const transformerRef = useRef(null);
    const stageRef = useRef(null);

    const addLine = () => {
        const offset = lines.length * 2;
        const newLine = {
            id: `line-${lines.length}`,
            points: [50 + offset, 50 - offset, 150 + offset, 150 - offset],
            stroke: "black",
            strokeWidth: 2,
            draggable: true
        };
        setLines([...lines, newLine]);
        setSelectedId(newLine.id);
    };

    const addText = () => {
        const newText = {
            id: `text-${texts.length}`,
            x: 100,
            y: 100 + texts.length * 10,
            text: "Click to edit",
            fontSize: 20,
            fill: "black",
            draggable: true
        };
        setTexts([...texts, newText]);
    };

    const addRect = () => {
        const newRect = {
            id: `rect-${rects.length}`,
            x: 150,
            y: 150 + rects.length * 10,
            width: 100,
            height: 50,
            fill: "blue",
            draggable: true
        };
        setRects([...rects, newRect]);
    };

    const handleSelect = (id, e) => {
        setSelectedId(id);
        if (transformerRef.current) {
            transformerRef.current.nodes([e.target]);
            transformerRef.current.getLayer().batchDraw();
        }
    };

    const handleTextDblClick = (textNode, e) => {
        const textPosition = textNode.absolutePosition();
        const stageBox = stageRef.current.container().getBoundingClientRect();

        const textarea = document.createElement("textarea");
        document.body.appendChild(textarea);

        textarea.value = textNode.text();
        textarea.style.position = "absolute";
        textarea.style.top = `${stageBox.top + textPosition.y}px`;
        textarea.style.left = `${stageBox.left + textPosition.x}px`;
        textarea.style.fontSize = `${textNode.fontSize()}px`;
        textarea.style.border = "none";
        textarea.style.padding = "0px";
        textarea.style.margin = "0px";
        textarea.style.overflow = "hidden";
        textarea.style.background = "none";
        textarea.style.outline = "none";
        textarea.style.resize = "none";
        textarea.style.lineHeight = textNode.lineHeight();
        textarea.style.fontFamily = textNode.fontFamily();
        textarea.style.textAlign = textNode.align();
        textarea.style.color = textNode.fill();

        textarea.focus();

        function removeTextarea() {
            textNode.text(textarea.value);
            document.body.removeChild(textarea);
            textNode.show();
            transformerRef.current.show();
            transformerRef.current.forceUpdate();
        }

        textarea.addEventListener("keydown", function (e) {
            if (e.key === "Enter" && !e.shiftKey) {
                removeTextarea();
            }
            if (e.key === "Escape") {
                removeTextarea();
            }
        });

        setTimeout(() => {
            window.addEventListener("click", function handleClickOutside(e) {
                if (e.target !== textarea) {
                    removeTextarea();
                    window.removeEventListener("click", handleClickOutside);
                }
            });
        });
    };

    return (
        <div style={{ position: "relative", width: "493px", height: "323px", border: "1px solid gray" }}>
            <Stage
                ref={stageRef}
                width={493}
                height={323}
                onMouseDown={(e) => {
                    if (e.target === e.target.getStage()) {
                        setSelectedId(null);
                        setEditingText(null);
                        transformerRef.current.nodes([]);
                        transformerRef.current.getLayer().batchDraw();
                    }
                }}
            >
                <Layer>
                    <Group>
                        <Rect width={493} height={323} fill="transparent" stroke="gray" strokeWidth={1} />
                        {texts.map((text) => (
                            <KonvaText
                                key={text.id}
                                {...text}
                                onClick={(e) => handleSelect(text.id, e)}
                                onDblClick={(e) => handleTextDblClick(e.target, e)}
                            />
                        ))}
                        {lines.map((line) => (
                            <KonvaLine
                                key={line.id}
                                {...line}
                                onClick={(e) => handleSelect(line.id, e)}
                            />
                        ))}
                        {rects.map((rect) => (
                            <Rect
                                key={rect.id}
                                {...rect}
                                onClick={(e) => handleSelect(rect.id, e)}
                            />
                        ))}
                        {selectedId !== null && <Transformer ref={transformerRef} />}
                    </Group>
                </Layer>
            </Stage>
            <div style={{ display: "flex" }}>
                <div style={{ width: 75, height: 65, border: "1px solid green", cursor: "pointer" }} onClick={addLine}>Line</div>
                <div style={{ width: 75, height: 65, border: "1px solid green", cursor: "pointer" }} onClick={addText}>Text</div>
                <div style={{ width: 75, height: 65, border: "1px solid green", cursor: "pointer" }} onClick={addRect}>Rect</div>
            </div>
        </div>
    );
};