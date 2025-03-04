import { useCallback, useMemo, useState } from "react";
import {
  BuildEditorProps,
  CIRCLE_OPTIONS,
  DIAMOND_OPTIONS,
  Editor,
  RECTANGLE_OPTIONS,
  TRIANGLE_OPTIONS,
} from "@/types";
import { useAutoResize } from "@/hooks/use-auto-resize";
import { fabric } from "fabric";

const buildEditor = ({ canvas }: BuildEditorProps): Editor => {
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
    addCircle: () => {
      const object = new fabric.Circle({ ...CIRCLE_OPTIONS });
      addToCanvas(object);
    },
    addSoftRectangle: () => {
      const object = new fabric.Rect({ ...RECTANGLE_OPTIONS, rx: 50, ry: 50 });
      addToCanvas(object);
    },
    addRectangle: () => {
      const object = new fabric.Rect(RECTANGLE_OPTIONS);
      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({ ...CIRCLE_OPTIONS });
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
        { ...TRIANGLE_OPTIONS },
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
  };
};
export const useEditor = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  useAutoResize({ canvas, container });
  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({ canvas });
    }
    return undefined;
  }, [canvas]);

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
