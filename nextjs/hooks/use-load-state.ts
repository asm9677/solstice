"use client";
import { fabric } from "fabric";
import { useEffect, useRef } from "react";

interface UseLoadStateProps {
  autoZoom: () => void;
  canvas: fabric.Canvas | null;
}

export const useLoadState = ({ canvas, autoZoom }: UseLoadStateProps) => {
  const initialized = useRef(false);
  const initialState = useRef<string | undefined>(
    localStorage.getItem("autosave_canvas"),
  );
  useEffect(() => {
    if (!initialized.current && initialState?.current && canvas) {
      const data = JSON.parse(initialState.current);

      canvas.loadFromJSON(data, () => {
        autoZoom();
      });
      initialized.current = true;
    }
  }, [
    canvas,
    autoZoom,
    initialState, // no need, this is a ref
  ]);
};
