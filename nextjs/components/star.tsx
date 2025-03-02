"use client";

import { Star as KonvaStar } from "react-konva";
import type { Star } from "@/types";

const Star = ({ data, onClick }: { data: Star; onClick: () => void }) => {
  console.log("star rendered");
  return <KonvaStar {...data} onClick={onClick} />;
};

export default Star;
