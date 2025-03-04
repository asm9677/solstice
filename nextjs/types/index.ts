import { fabric } from "fabric";

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

type ActiveTool =
  | "select"
  | "shapes"
  | "text"
  | "images"
  | "draw"
  | "fill"
  | "stroke-color"
  | "stroke-width"
  | "font"
  | "opacity"
  | "filter"
  | "settings"
  | "remove-bg"
  | "templates";

type BuildEditorProps = {
  canvas: fabric.Canvas;
};

interface Editor {
  addCircle: () => void;
  addSoftRectangle: () => void;
  addRectangle: () => void;
  addTriangle: () => void;
  addInverseTriangle: () => void;
  addDiamond: () => void;
}

const FILL_COLOR = "rgba(0, 0, 0,1)";
const STROKE_COLOR = "rgba(0, 0, 0, 1)";
const STROKE_WIDTH = 2;
const CIRCLE_OPTIONS = {
  radius: 225,
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
};

const RECTANGLE_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 400,
  height: 400,
  angle: 0,
};
const DIAMOND_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 600,
  height: 600,
  angle: 0,
};

const TRIANGLE_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 400,
  height: 400,
  angle: 0,
};

export { CIRCLE_OPTIONS, RECTANGLE_OPTIONS, TRIANGLE_OPTIONS, DIAMOND_OPTIONS };
export type {
  Shape,
  Rect,
  TextBox,
  Line,
  Position,
  Star,
  Circle,
  ActiveTool,
  BuildEditorProps,
  Editor,
};
