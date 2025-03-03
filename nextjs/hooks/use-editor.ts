import { useCallback, useState } from "react";
import { useAutoResize } from "@/hooks/use-auto-resize";
import { fabric } from "fabric";

export const useEditor = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  useAutoResize({ canvas, container });

  const init = useCallback(
    ({
      initialContainer,
      initialCanvas,
    }: {
      initialContainer: HTMLDivElement;
      initialCanvas: fabric.Canvas;
    }) => {
      const initialWorkspace = new fabric.Rect({
        width: 900,
        height: 1200,
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

      const test = new fabric.Rect({
        height: 100,
        width: 100,
        fill: "black",
      });

      initialCanvas.add(test);
      initialCanvas.centerObject(test);
    },
    [],
  );
  return { init };
};
