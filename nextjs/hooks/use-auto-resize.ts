import { useCallback, useEffect } from "react";
import { fabric } from "fabric";

interface UseAutoResizeProps {
  canvas: fabric.Canvas | null;
  container: HTMLDivElement | null;
}

export const useAutoResize = ({ canvas, container }: UseAutoResizeProps) => {
  const autoZoom = useCallback(() => {
    if (!canvas || !container) {
      return;
    }

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    canvas.setWidth(width);
    canvas.setHeight(height);

    const center = canvas.getCenter(); // get center coordinates
    const zoomRatio = 0.85;
    const localWorkspace = canvas
      .getObjects()
      .find((object) => object.name == "clip");

    if (!localWorkspace) {
      console.warn("⚠️ localWorkspace (clip object) not found!");
      return;
    }
    const scale = (fabric.util as any).findScaleToFit(localWorkspace, {
      width,
      height,
    });
    const zoom = zoomRatio * scale; // fit scale to zoom ratio 0.85

    canvas.setViewportTransform(fabric.iMatrix.concat()); // reset to original state before zooming
    canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoom); // apply zoom based on center coordinates

    if (!localWorkspace) {
      return;
    }
    const workspaceCenter = localWorkspace.getCenterPoint();
    const viewportTransform = canvas.viewportTransform;
    if (
      canvas.width == undefined ||
      canvas.height == undefined ||
      !viewportTransform // check cause setViewportTransform() might not get applied immediately
    ) {
      return;
    }
    // viewportTransform initial state = [1,0,0,1,0,0] scaleX, skewX, skewY, scaleY, translateX, translateY
    // center workspace correspondent to scale
    viewportTransform[4] =
      canvas.width / 2 - workspaceCenter.x * viewportTransform[0];

    viewportTransform[5] =
      canvas.height / 2 - workspaceCenter.y * viewportTransform[3];
    canvas.setViewportTransform(viewportTransform);
    localWorkspace.clone((cloned: fabric.Rect) => {
      canvas.clipPath = cloned;
      const workspaceBounds = cloned.getBoundingRect();

      canvas.getObjects().forEach((obj) => {
        if (obj.name !== "clip") {
          // 원래 workspace 대비 상대적 위치 유지
          const originalLeft = obj.get("originalLeft" as any);
          const originalTop = obj.get("originalTop" as any);

          if (originalLeft !== undefined && originalTop !== undefined) {
            obj.set({
              left: workspaceBounds.left + originalLeft * workspaceBounds.width,
              top: workspaceBounds.top + originalTop * workspaceBounds.height,
            });
            obj.setCoords();
          }
        }
      });
      canvas.requestRenderAll();
    });
  }, [canvas, container]);

  useEffect(() => {
    if (!canvas) return;
    window.addEventListener("resize", autoZoom);

    return () => {
      window.removeEventListener("resize", autoZoom);
    };
  }, [autoZoom, container, canvas]);

  return { autoZoom };
};
