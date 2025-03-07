import { useCallback, useMemo, useState } from "react";
import {
  BuildEditorProps,
  CIRCLE_OPTIONS,
  DIAMOND_OPTIONS,
  Editor,
  EditorHookProps,
  FILL_COLOR,
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
  JSON_KEYS,
  RECTANGLE_OPTIONS,
  STROKE_COLOR,
  STROKE_WIDTH,
  TEXT_OPTIONS,
  TRIANGLE_OPTIONS,
} from "@/types";
import { useAutoResize } from "@/hooks/use-auto-resize";
import { fabric } from "fabric";
import useCanvasEvents from "@/hooks/use-canvas-events";
import {
  dataURLtoBlob,
  downloadFile,
  isTextType,
  transformText,
} from "@/lib/utils";

const buildEditor = ({
  canvas,
  fillColor,
  setFillColor,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  selectedObjects,
  fontFamily,
  setFontFamily,
  autoZoom,
}: BuildEditorProps): Editor => {
  const generateSaveOptions = () => {
    const { width, height, left, top } = getWorkspace() as fabric.Rect;

    return {
      name: "Image",
      format: "png",
      quality: 1,
      width,
      height,
      left,
      top,
    };
  };

  const saveImage = (type: string) => {
    let fileData;
    if (type === "svg") {
      fileData = new Blob([canvas.toSVG()], { type: "image/svg+xml" });
    } else {
      const options = generateSaveOptions();
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      fileData = dataURLtoBlob(canvas.toDataURL(options));
    }
    downloadFile(fileData, type);
  };

  const saveJson = async () => {
    const dataUrl = canvas.toJSON(JSON_KEYS);
    await transformText(dataUrl.objects);

    const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataUrl, null, "\t"))}`;
    downloadFile(fileString, "json");
  };
  const loadJson = (json: string) => {
    const data = JSON.parse(json);

    canvas.loadFromJSON(data, autoZoom);
  };

  const getWorkspace = () => {
    return canvas.getObjects().find((object) => object.name === "clip");
  };
  const center = (object: fabric.Object) => {
    const workspace = getWorkspace();
    const center = workspace?.getCenterPoint();
    if (!center) return;
    // @ts-expect-error-error
    canvas._centerObject(object, center);
  };

  const addToCanvas = (object: fabric.Object) => {
    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
  };
  return {
    saveImage,
    saveJson,
    loadJson,
    addImage: (value: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      fabric.Image.fromURL(value, (image) => {
        const workspace = getWorkspace();
        image.scaleToWidth(workspace?.width || 0);
        image.scaleToHeight(workspace?.width || 0);
        addToCanvas(image);
      }),
        { crossOrigin: "anonymous" };
    },
    delete: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.remove(object);
        canvas.discardActiveObject();
        canvas.renderAll();
      });
    },
    changeFontFamily: (value: string) => {
      setFontFamily(value);
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-expect-error-error
          object.set({ fontFamily: value });
        }
      });
      canvas.renderAll();
    },
    changeFontWeight: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-expect-error-error
          object.set({ fontWeight: value });
        }
      });
      canvas.renderAll();
    },
    changeFontStyle: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-expect-error-error
          object.set({ fontStyle: value });
        }
      });
      canvas.renderAll();
    },
    changeFontSize: (value: number) => {
      setStrokeWidth(value);
      canvas.getActiveObjects().forEach((object) => {
        // @ts-expect-error-error
        object.set({ fontSize: value });
      });
      canvas.renderAll();
    },
    getActiveFontSize: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return fontFamily;
      }
      // @ts-expect-error-error
      return selectedObject.get("fontSize") || FONT_SIZE;
    },
    getActiveFontFamily: () => {
      if (selectedObjects) {
        const selectedObject = selectedObjects[0];
        if (!selectedObject) {
          return fontFamily;
        }
        // @ts-expect-error-error
        return selectedObject.get("fontFamily") || fontFamily;
      }
      return fontFamily;
    },
    getActiveFontStyle: () => {
      if (selectedObjects) {
        const selectedObject = selectedObjects[0];
        if (!selectedObject) {
          return fontFamily;
        }
        // @ts-expect-error-error
        return selectedObject.get("fontStyle") || "normal";
      }
      return "normal";
    },
    getActiveFontWeight: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return FONT_WEIGHT;
      }
      // @ts-expect-error-error
      return selectedObject.get("fontWeight") || FONT_WEIGHT;
    },
    addText: (value, options) => {
      const object = new fabric.Textbox(value, {
        ...TEXT_OPTIONS,
        fill: fillColor,
        ...options,
      });
      addToCanvas(object);
    },
    bringForward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.bringForward(object);
      });
      canvas.renderAll();
      const workspace = getWorkspace();
      workspace?.sendToBack();
    },
    sendBackwards: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.sendBackwards(object);
      });
      canvas.renderAll();
      const workspace = getWorkspace();
      workspace?.sendToBack();
    },
    changeFillColor: (value: string) => {
      setFillColor(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ fill: value });
      });
      canvas.renderAll();
    },
    changeStrokeColor: (value: string) => {
      setStrokeColor(value);
      canvas.getActiveObjects().forEach((object) => {
        // Text types don't have stroke
        if (isTextType(object.type)) {
          object.set({ fill: value });
          return;
        }
        object.set({ stroke: value });
        canvas.renderAll();
      });
    },
    changeStrokeWidth: (value: number) => {
      setStrokeWidth(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: value });
      });
      canvas.renderAll();
    },
    addCircle: () => {
      const object = new fabric.Circle({
        ...CIRCLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth,
      });
      addToCanvas(object);
    },
    addSoftRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 50,
        ry: 50,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth,
      });
      addToCanvas(object);
    },
    addRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth,
      });
      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...CIRCLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth,
      });
      addToCanvas(object);
    },
    addInverseTriangle: () => {
      const HEIGHT = TRIANGLE_OPTIONS.height;
      const WIDTH = TRIANGLE_OPTIONS.width;
      const object = new fabric.Polygon(
        [
          { x: 0, y: 0 },
          { x: WIDTH, y: 0 },
          {
            x: WIDTH / 2,
            y: HEIGHT,
          },
        ],
        {
          ...TRIANGLE_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth,
        },
      );
      addToCanvas(object);
    },
    addDiamond: () => {
      const HEIGHT = DIAMOND_OPTIONS.height;
      const WIDTH = DIAMOND_OPTIONS.width;
      const object = new fabric.Polygon(
        [
          { x: WIDTH / 2, y: 0 },
          { x: WIDTH, y: HEIGHT / 2 },
          { x: WIDTH / 2, y: HEIGHT },
          {
            x: 0,
            y: HEIGHT / 2,
          },
        ],
        { ...DIAMOND_OPTIONS },
      );
      addToCanvas(object);
    },
    canvas,
    getActiveFillColor: () => {
      if (selectedObjects) {
        const selectedObject = selectedObjects[0];
        if (!selectedObject) {
          return fillColor;
        }

        const value = selectedObject.get("fill") || fillColor;
        return value as string;
      }
      return fillColor;
    },
    getActiveStrokeColor: () => {
      if (selectedObjects) {
        const selectedObject = selectedObjects[0];
        if (!selectedObject) {
          return strokeColor;
        }

        return selectedObject.get("stroke") || strokeColor;
      }
      return strokeColor;
    },
    strokeWidth,
    selectedObjects,
  };
};

export const useEditor = ({ clearSelectionCallback }: EditorHookProps) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  const [fontFamily, setFontFamily] = useState(FONT_FAMILY);
  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const { autoZoom } = useAutoResize({ canvas, container });

  useCanvasEvents({ canvas, setSelectedObjects, clearSelectionCallback });
  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({
        canvas,
        fillColor,
        setFillColor,
        autoZoom,
        strokeColor,
        setStrokeColor,
        strokeWidth,
        setStrokeWidth,
        selectedObjects,
        fontFamily,
        setFontFamily,
      });
    }
    return undefined;
  }, [canvas, fontFamily, strokeColor, strokeWidth, selectedObjects]);

  const init = useCallback(
    ({
      initialContainer,
      initialCanvas,
    }: {
      initialContainer: HTMLDivElement;
      initialCanvas: fabric.Canvas;
    }) => {
      const initialWorkspace = new fabric.Rect({
        width: 1200,
        height: 900,
        name: "clip",
        hasControls: false,
        selectable: false,
        fill: "white",
        shadow: new fabric.Shadow({
          color: "rgba(0, 0, 0, 0.5)",
          blur: 5,
        }),
      });

      fabric.Object.prototype.set({
        cornerColor: "#FFF",
        cornerStyle: "circle",
        borderColor: "#3b82f6",
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: "#3b82f6",
      });
      initialCanvas.setWidth(initialContainer.offsetWidth);
      initialCanvas.setHeight(initialContainer.offsetHeight);

      initialCanvas.add(initialWorkspace);
      initialCanvas.centerObject(initialWorkspace);
      initialCanvas.clipPath = initialWorkspace;

      setCanvas(initialCanvas);
      setContainer(initialContainer);
    },
    [],
  );
  return { init, editor };
};
