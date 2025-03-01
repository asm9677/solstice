"use client";

import React, { RefObject, useEffect, useRef, useState } from "react";
import { Layer, Stage, Transformer } from "react-konva";
import TextBox from "@/components/text-box";
import {
  Line as LineType,
  Position,
  Shape,
  TextBox as TextBoxType,
} from "@/types";
import Rect from "@/components/rect";
import Line from "@/components/line";

export const Canvas = () => {
  const [lines, setLines] = useState<LineType[]>([]);
  const [texts, setTexts] = useState<TextBoxType[]>([]);
  const [rects, setRects] = useState<Shape[]>([]);
  const [circles, setCircles] = useState<Shape[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState(null);
  const transformerRef = useRef<Transformer | null>(null);
  const stageRef: RefObject<any> = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  const addLine = () => {
    const offset = lines.length * 2;
    const newLine = {
      id: `line-${lines.length}`,
      points: [50 + offset, 50 - offset, 150 + offset, 150 - offset],
      stroke: "black",
      strokeWidth: 2,
      draggable: true,
    };
    setLines([...lines, newLine]);
    setSelectedId(newLine.id);
  };
  const modifiedText = () => {};
  const addText = () => {
    const newText = {
      id: `text-${texts.length}`,
      x: 100,
      y: 100 + texts.length * 10,
      text: "Click to edit",
      fontSize: 20,
      fill: "black",
      draggable: true,
    };
    console.log("new texts:: should be arr", [...texts, newText]);
    setTexts([...texts, newText]);
  };

  const addRect = () => {
    const newRect: Shape = {
      id: `rect-${rects.length}`,
      x: 150,
      y: 150 + rects.length * 10,
      width: 100,
      height: 50,
      fill: "blue",
      draggable: true,
    };
    setRects((prev: Shape[]) => {
      return [...prev, newRect];
    });
  };
  // 클릭 시 도형 선택
  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const updateTextBox = (
    id: string,
    newText: string,
    newPosition: Position,
  ) => {
    console.log({ id, newText, newPosition });
    const newTexts = texts.map((elem) => {
      if (elem.id === id) {
        elem.x = newPosition.x;
        elem.y = newPosition.y;
        elem.width = newPosition.width;
        elem.height = newPosition.height;
        elem.text = newText;
      }
      return elem;
    });

    setTexts(newTexts);
  };
  useEffect(() => {
    if (transformerRef.current) {
      const selectedNode = stageRef.current?.findOne(`#${selectedId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      } else {
        transformerRef.current.nodes([]);
      }
    }
  }, [selectedId]);

  return (
    <div>
      <Stage
        ref={stageRef}
        width={493}
        height={323}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
            setSelectedId(null);
            setEditingText(null);
            if (transformerRef.current) {
              transformerRef.current.nodes([]);
              transformerRef.current.getLayer().batchDraw();
            }
          }
        }}
      >
        <Layer>
          {texts.map((text) => (
            <TextBox
              key={text.id}
              textData={text}
              onClick={() => handleSelect(text.id)}
              stageRef={stageRef}
              updateTextBox={updateTextBox}
            />
          ))}
          {lines.map((line) => (
            <Line
              key={line.id}
              {...line}
              onClick={(e) => handleSelect(line.id, e)}
            />
          ))}
          {rects.map((rect) => (
            <Rect
              key={rect.id}
              rect={rect}
              onClick={() => handleSelect(rect.id)}
            />
          ))}
          {selectedId !== null && <Transformer ref={transformerRef} />}
        </Layer>
      </Stage>
      <div className={"flex"}>
        <div
          style={{
            width: 75,
            height: 65,
            border: "1px solid green",
            cursor: "pointer",
          }}
          onClick={addLine}
        >
          Line
        </div>
        <div
          style={{
            width: 75,
            height: 65,
            border: "1px solid green",
            cursor: "pointer",
          }}
          onClick={addText}
        >
          Text
        </div>
        <div
          style={{
            width: 75,
            height: 65,
            border: "1px solid green",
            cursor: "pointer",
          }}
          onClick={addRect}
        >
          Rect
        </div>
      </div>
    </div>
  );
};
