"use client";

import React, { useRef, useState } from "react";
import { Stage, Layer, Rect, Transformer, Group, Line as KonvaLine, Text as KonvaText } from "react-konva";
import {TextBox} from "@/components/text-box";
import { TextBox as TextBoxType } from "@/types";

export const Canvas = () => {
    const [lines, setLines] = useState([]);
    const [texts, setTexts] = useState<TextBoxType[]>([]);
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
        console.log('text')
        const newText = {
            id: `text-${texts.length}`,
            x: 100,
            y: 100 + texts.length * 10,
            text: "Click to edit",
            fontSize: 20,
            fill: "black",
            draggable: true
        };
        console.log("new texts:: should be arr", [...texts, newText])
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
       console.log({onClick: id})
        setSelectedId(id);
        if (transformerRef.current) {
            transformerRef.current.nodes([e.target]);
            transformerRef.current.getLayer().batchDraw();
        }
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
                            <TextBox
                                stageRef={stageRef}
                                transformerRef={transformerRef}
                                key={text.id}
                                {...text}
                                onClick={(id, e) => handleSelect(id, e)}
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