import { fabric } from "fabric";

import * as material from "material-colors";

const colors = [
  material.red["500"],
  material.pink["500"],
  material.purple["500"],
  material.deepPurple["500"],
  material.indigo["500"],
  material.blue["500"],
  material.lightBlue["500"],
  material.cyan["500"],
  material.teal["500"],
  material.green["500"],
  material.lightGreen["500"],
  material.lime["500"],
  material.yellow["500"],
  material.amber["500"],
  material.orange["500"],
  material.deepOrange["500"],
  material.brown["500"],
  material.blueGrey["500"],
  "transparent",
];

interface Shape {
  id: string;
  x: number;
  y: number;
  fill: string;
  width?: number;
  height?: number;
  draggable: boolean;
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
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  setFillColor: (color: string) => void;
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  selectedObjects: fabric.Object[] | null;
};

interface Editor {
  changeFillColor: (color: string) => void;
  changeStrokeColor: (color: string) => void;
  changeStrokeWidth: (width: number) => void;
  addCircle: () => void;
  addSoftRectangle: () => void;
  addRectangle: () => void;
  addTriangle: () => void;
  addInverseTriangle: () => void;
  addDiamond: () => void;
  getActiveFillColor: () => string;
  getActiveStrokeColor: () => string;
  strokeWidth: number;
  canvas: fabric.Canvas;
  selectedObjects: fabric.Object[] | null;
}

interface EditorHookProps {
  clearSelectionCallback?: () => void;
}

const selectionDependentTools = [
  "fill",
  "font",
  "filter",
  "opacity",
  "remove-bg",
  "stroke-color",
  "stroke-width",
];

const FILL_COLOR = "#000000";
const STROKE_COLOR = "#000000";
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

export {
  CIRCLE_OPTIONS,
  RECTANGLE_OPTIONS,
  TRIANGLE_OPTIONS,
  DIAMOND_OPTIONS,
  FILL_COLOR,
  STROKE_COLOR,
  STROKE_WIDTH,
  colors,
  selectionDependentTools,
};
export type { Shape, ActiveTool, BuildEditorProps, Editor, EditorHookProps };
