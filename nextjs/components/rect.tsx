"use client";

import React from "react";
import { Rect as KonvaRect } from "react-konva";

const Rect = ({ rect, onClick }) => {
  return (
    <KonvaRect
      key={rect.id}
      {...rect}
      onClick={() => onClick(rect.id)}
      draggable
    />
  );
};

export default Rect;
