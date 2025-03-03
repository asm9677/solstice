interface Shape {
  id: string;
  x: number;
  y: number;
  fill: string;
  width?: number;
  height?: number;
  draggable: boolean;
}

interface Rect extends Shape {}

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

interface Star extends Shape {
  numPoints: number;
  innerRadius: number;
  outerRadius: number;
}

interface Circle extends Shape {
  radius: number;
}

interface Position {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export type { Shape, Rect, TextBox, Line, Position, Star, Circle };
