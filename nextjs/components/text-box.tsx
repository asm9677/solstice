"use client";

import React, { RefObject, useRef, useState } from "react";
import { Text as KonvaText } from "react-konva";
import { Html } from "react-konva-utils";
import { Position, TextBox as TextBoxType } from "@/types";
import Konva from "konva";

const TextBox = ({
  onClick,
  textData,
  stageRef,
  updateTextBox,
}: {
  onClick: () => void;
  textData: TextBoxType;
  stageRef: RefObject<Konva.Stage>;
  updateTextBox: (id: string, newText: string, newPosition: Position) => void;
}) => {
  const textRef = useRef<Konva.Text | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [text, setText] = useState(textData.text);
  const [isEditing, setIsEditing] = useState(false);
  const [position, setPosition] = useState<Position | null>({
    x: textData.x,
    y: textData.y,
  });

  // 🟢 더블 클릭하면 textarea 표시
  const handleTextDblClick = () => {
    const textNode = textRef.current;
    const stage = stageRef.current;
    if (!textNode || !stage) return;
    const textPosition = textNode.absolutePosition();
    setPosition({
      x: textPosition.x,
      y: textPosition.y,
      width: textNode.width(),
      height: textNode.height(),
    });
    setIsEditing(true);

    setTimeout(() => {
      document.getElementById(`text-input-${textData.id}`)?.focus();
    }, 10);
  };

  // 🟢 입력 값 변경
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  function handleEscapeKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.key === "Enter" && !e.shiftKey) || e.key === "Escape") {
      setIsEditing((prev) => !prev);
    }
  }

  const handleInputBlur = () => {
    const textareaNode = textareaRef.current;
    if (!textareaNode) return;

    // 기존 Konva.Text의 위치 유지
    const newPosition = {
      x: textData.x, // ✅ 기존 X 위치 유지
      y: textData.y, // ✅ 기존 Y 위치 유지
      width: textData.width,
      height: textData.height,
    };

    const newText = textareaNode.value;

    // 업데이트 반영
    updateTextBox(textData.id, newText, newPosition);

    console.log("Textarea blurred, position retained:", newPosition);

    setIsEditing(false);
  };

  return (
    <>
      {/* 🟢 Canvas 바깥에서 textarea 표시 */}
      {isEditing ? (
        <Html>
          <textarea
            ref={textareaRef}
            id={`text-input-${textData.id}`}
            value={text}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="absolute bg-transparent text-black text-lg outline-none resize-none p-0 m-0 border-none"
            onKeyDown={handleEscapeKey}
            style={{
              top: position?.y || 0,
              left: position?.x || 0,
              width: position?.width || 0,
            }}
          />
          ?
        </Html>
      ) : (
        <KonvaText
          ref={textRef}
          {...textData}
          fontFamily="geist-mono"
          onDblClick={handleTextDblClick}
          onDblTap={handleTextDblClick}
          onClick={onClick}
        />
      )}
    </>
  );
};

export default TextBox;
