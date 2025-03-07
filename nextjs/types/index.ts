import { fabric } from "fabric";

import * as material from "material-colors";
import { ITextboxOptions } from "fabric/fabric-impl";

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

const JSON_KEYS = [
  "name",
  "gradientAngle",
  "selectable",
  "hasControls",
  "linkData",
  "editable",
  "extensionType",
  "extension",
];

const fonts = [
  "Arial",
  "Arial Black",
  "Verdana",
  "Helvetica",
  "Tahoma",
  "Trebuchet MS",
  "Times New Roman",
  "Georgia",
  "Garamond",
  "Courier New",
  "Brush Script MT",
  "Palatino",
  "Bookman",
  "Comic Sans MS",
  "Impact",
  "Lucida Sans Unicode",
  "Geneva",
  "Lucida Console",
];

type BuildEditorProps = {
  canvas: fabric.Canvas;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  setFillColor: (color: string) => void;
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  selectedObjects: fabric.Object[];
  fontFamily: string;
  setFontFamily: (family: string) => void;
  autoZoom: () => void;
};

interface Editor {
  saveImage: (type: string) => void;
  saveJson: () => void;
  loadJson: (json: string) => void;
  addImage: (value: string) => void;
  delete: () => void;
  addText: (value: string, options?: ITextboxOptions) => void;
  bringForward: () => void;
  sendBackwards: () => void;
  changeFontFamily: (family: string) => void;
  changeFontWeight: (weight: number) => void;
  changeFillColor: (color: string) => void;
  changeStrokeColor: (color: string) => void;
  changeStrokeWidth: (width: number) => void;
  changeFontSize: (fontSize: number) => void;
  changeFontStyle: (style: string) => void;
  getActiveFontFamily: () => string;
  getActiveFontWeight: () => number;
  getActiveFontStyle: () => void;
  getActiveFontSize: () => number;
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
  selectedObjects: fabric.Object[];
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

const FONT_FAMILY = "Arial";
const FONT_SIZE = 32;
const FONT_WEIGHT = 400;
const FONT_STYLE = "normal";
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
const TEXT_OPTIONS = {
  type: "textbox",
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  fontSize: FONT_SIZE,
  fontFamily: FONT_FAMILY,
};

export {
  CIRCLE_OPTIONS,
  RECTANGLE_OPTIONS,
  TRIANGLE_OPTIONS,
  DIAMOND_OPTIONS,
  TEXT_OPTIONS,
  FONT_FAMILY,
  FONT_STYLE,
  FONT_WEIGHT,
  FONT_SIZE,
  FILL_COLOR,
  STROKE_COLOR,
  STROKE_WIDTH,
  JSON_KEYS,
  colors,
  selectionDependentTools,
  fonts,
};
export type { ActiveTool, BuildEditorProps, Editor, EditorHookProps };
