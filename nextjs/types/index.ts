interface Shape {
  id: string;
  x: number;
  y: number;
  fill: string;
  width?: number;
  height?: number;
  draggable: boolean;
}

interface TextBox extends Shape {
  text: string;
  fontSize: number;
}

interface Line {
  id: string;
  points: number[];
  stroke: string;
  strokeWidth: number;
  draggable: boolean;
}

interface Position {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export type { Shape, TextBox, Line, Position };
