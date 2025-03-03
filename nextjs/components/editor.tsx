"use client";
import { useEditor } from "@/hooks/use-editor";
import { useEffect, useRef } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/layout/sidebar";
import Footer from "@/components/layout/footer";
import Toolbar from "@/components/toolbar";
import { fabric } from "fabric";

const Editor = () => {
  console.log("init");
  const { init } = useEditor();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef(null);

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
      <Navbar />
      <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
        <Sidebar />
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
