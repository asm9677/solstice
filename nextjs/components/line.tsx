import { Group, Line as KonvaLine, Rect } from "react-konva";
import React from "react";

const Line = ({ onClick, ...line }) => {
  const x1 = line.points[0],
    y1 = line.points[1];
  const x2 = line.points[2],
    y2 = line.points[3];

  // 사각형 크기 계산 (시작점과 끝점을 포함하는 Bounding Box)
  const rectX = Math.min(x1, x2) - line.strokeWidth * 2;
  const rectY = Math.min(y1, y2) - line.strokeWidth * 2;
  const rectWidth = Math.abs(x2 - x1) + line.strokeWidth * 4;
  const rectHeight = Math.abs(y2 - y1) + line.strokeWidth * 4;
  return (
    <Group
      id={line.id}
      onClick={(e) => {
        onClick(line.id);
        e.cancelBubble = true;
      }}
      draggable={true}
    >
      <Rect
        x={rectX}
        y={rectY}
        width={rectWidth}
        height={rectHeight}
        fill="transparent"
      />
      <KonvaLine {...line} />
    </Group>
  );
};
export default Line;
