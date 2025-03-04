"use client";
import { useEditor } from "@/hooks/use-editor";
import { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/layout/sidebar";
import Footer from "@/components/layout/footer";
import Toolbar from "@/components/toolbar";
import { fabric } from "fabric";
import { ActiveTool } from "@/types";
import ShapeSidebar from "@/components/shape-sidebar";

const Editor = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool>("select");

  const { init, editor } = useEditor();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef(null);

  const onChangeActiveTool = useCallback(
    (tool: ActiveTool) => {
      console.log("clicked");
      if (tool === activeTool) {
        return setActiveTool("select");
      }
      setActiveTool(tool);
    },
    [activeTool],
  );
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });
    init({ initialContainer: containerRef.current!, initialCanvas: canvas });

    return () => {
      canvas.dispose();
    };
  }, [init]);

  return (
    <div className="h-full flex flex-col">
      <Navbar activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
      <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
        <Sidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <ShapeSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <main
          className={"bg-muted flex-1 overflow-auto relative flex-flex-col"}
        >
          <Toolbar />
          <div
            ref={containerRef}
            className="flex-1 h-[calc(100%-124px)] bg-muted"
          >
            <canvas ref={canvasRef} />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Editor;
