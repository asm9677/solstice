import { fabric } from "fabric";
import { useEffect } from "react";

interface UseCanvasEventsProps {
  canvas: fabric.Canvas | null;
  setSelectedObjects: (objects: fabric.Object[]) => void;
  clearSelectionCallback?: () => void;
}

const useCanvasEvents = ({
  canvas,
  setSelectedObjects,
  clearSelectionCallback,
}: UseCanvasEventsProps) => {
  useEffect(() => {
    if (canvas) {
      console.log({ canvas });
      canvas.on("selection:created", (e) => {
        console.log("selected:created");
        setSelectedObjects(e.selected || []);
      });
      canvas.on("selection:updated", (e) => {
        console.log("selection:updated");
        setSelectedObjects(e.selected || []);
      });
      canvas.on("selection:cleared", () => {
        console.log("selection:cleared");
        setSelectedObjects([]);
        clearSelectionCallback?.();
      });
    }
    return () => {
      if (canvas) {
        canvas.off("selected:created");
        canvas.off("selected:updated");
        canvas.off("selected:cleared");
      }
    };
  }, [canvas, setSelectedObjects, clearSelectionCallback]);
};

export default useCanvasEvents;
