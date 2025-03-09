"use client";
import { useEditor } from "@/hooks/use-editor";
import { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/layout/sidebar";
import Footer from "@/components/layout/footer";
import Toolbar from "@/components/toolbar";
import { fabric } from "fabric";
import { ActiveTool, selectionDependentTools } from "@/types";
import ShapeSidebar from "@/components/shape-sidebar";
import FillColorSidebar from "@/components/fill-color-sidebar";
import StrokeColorSidebar from "@/components/stroke-color-sidebar";
import TextSidebar from "@/components/text-sidebar";
import FontSidebar from "@/types/font-sidebar";
import ImageSidebar from "@/components/layout/image-sidebar";
import SettingsSidebar from "@/components/settings-sidebar";
import TemplateSidebar from "@/components/template-sidebar";

const Editor = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool>("select");
  const onClearSelection = useCallback(() => {
    if (selectionDependentTools.includes(activeTool)) {
      setActiveTool("select");
    }
  }, [activeTool]);
  const { init, isSaved, editor } = useEditor({
    clearSelectionCallback: onClearSelection,
    activeTool,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef(null);

  const onChangeActiveTool = useCallback(
    (tool: ActiveTool) => {
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
      <Navbar
        editor={editor}
        isSaved={isSaved}
        activeTool={activeTool}
        onChangeActiveTool={onChangeActiveTool}
      />
      <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
        <Sidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <TemplateSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <ShapeSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FillColorSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeColorSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />{" "}
        <TextSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />{" "}
        <FontSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />{" "}
        <ImageSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <SettingsSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <main
          className={"bg-muted flex-1 overflow-auto relative flex-flex-col"}
        >
          <Toolbar
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
            editor={editor}
            key={JSON.stringify(editor?.canvas.getActiveObject())}
          />
          <div
            ref={containerRef}
            className="flex-1 h-[calc(100%-124px)] bg-muted"
          >
            <canvas ref={canvasRef} />
          </div>
          <Footer editor={editor} />
        </main>
      </div>
    </div>
  );
};

export default Editor;
