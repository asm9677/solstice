"use client";
import { Circle as KonvaCircle } from "react-konva";
import type { Circle as CircleType } from "@/types";

const Circle = ({
  data,
  onClick,
}: {
  data: CircleType;
  onClick: () => void;
}) => {
  console.log("asdf");
  return (
    <KonvaCircle
      {...data}
      onClick={onClick} // 부모의 함수 호출
    />
  );
};

export default Circle;
