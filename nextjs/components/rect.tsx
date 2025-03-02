"use client";

import React from "react";
import { Rect as KonvaRect } from "react-konva";
import type { Rect as RectType } from "@/types";

const Rect = ({ rect, onClick }: { rect: RectType; onClick: () => void }) => (
  <KonvaRect key={rect.id} {...rect} onClick={onClick} draggable />
);

export default Rect;
