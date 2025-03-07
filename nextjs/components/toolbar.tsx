import {
  ActiveTool,
  Editor,
  FONT_SIZE,
  FONT_STYLE,
  FONT_WEIGHT,
} from "@/types";
import Hint from "@/components/hint";
import { cn, isTextType } from "@/lib/utils";
import { ArrowDown, ArrowUp, ChevronDown, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaBold, FaItalic } from "react-icons/fa";
import FontSizeInput from "@/hooks/font-size-input";
import { useState } from "react";

interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

const Toolbar = ({ editor, activeTool, onChangeActiveTool }: ToolbarProps) => {
  const initialFillColor = editor?.getActiveFillColor();
  const initialStrokeColor = editor?.getActiveStrokeColor();
  const initialFontFamily = editor?.getActiveFontFamily();
  const initialFontWeight = editor?.getActiveFontWeight() || FONT_WEIGHT;
  const initialFontStyle = editor?.getActiveFontStyle() || FONT_STYLE;
  const initialFontSize = editor?.getActiveFontSize() || FONT_SIZE;
  const [properties, setProperties] = useState({
    fillColor: initialFillColor,
    strokeColor: initialStrokeColor,
    fontFamily: initialFontFamily,
    fontWeight: initialFontWeight,
    fontSize: initialFontSize,
    fontStyle: initialFontStyle,
  });
  const selectedObjectType = editor?.selectedObjects[0]?.type;
  const isText = isTextType(selectedObjectType);
  const selectedObject = editor?.selectedObjects[0];

  if (
    editor?.selectedObjects === null ||
    editor?.selectedObjects?.length === 0
  ) {
    return (
      <div className="shrink-0 border-b h-[56px] bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2" />
    );
  }
  const toggleItalic = () => {
    if (!selectedObject) {
      return;
    }
    const isItalic = properties.fontStyle === "italic";
    const newValue = isItalic ? "normal" : "italic";
    editor?.changeFontStyle(newValue);
    setProperties((current) => ({
      ...current,
      fontStyle: newValue,
    }));
  };
  const toggleBold = () => {
    if (!selectedObject) {
      return;
    }
    const newValue = properties.fontWeight > 500 ? 500 : 700;
    editor?.changeFontWeight(newValue);
    setProperties((current) => ({
      ...current,
      fontWeight: newValue,
    }));
  };

  const onChangeFontSize = (value: number) => {
    if (!selectedObject) {
      return;
    }
    editor?.changeFontSize(value);
    setProperties((current) => ({
      ...current,
      fontSize: value,
    }));
  };
  return (
    <div className="shrink-0 border-b h-[56px] bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2">
      <div className="flex items-center h-full justify-center">
        <Hint label="Color" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("fill")}
            size="icon"
            variant="ghost"
            className={cn(activeTool === "fill" && "bg-gray-100")}
          >
            <div
              className="rounded-sm size-4 border"
              style={{ backgroundColor: properties.fillColor }}
            />
          </Button>
        </Hint>
      </div>
      {!isText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Stroke color" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("stroke-color")}
              size="icon"
              variant="ghost"
              className={cn(activeTool === "stroke-color" && "bg-gray-100")}
            >
              <div
                className="rounded-sm size-4 border-2 bg-white"
                style={{ borderColor: properties.strokeColor }}
              />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Font" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("font")}
              size="icon"
              variant="ghost"
              className={cn(
                "w-auto px-2 text-sm",
                activeTool === "font" && "bg-gray-100",
              )}
            >
              <div className="max-w-[100px] truncate">
                {properties.fontFamily}
              </div>
              <ChevronDown className="size-4 ml-2 shrink-0" />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center h-full justify-center">
          <Hint label={"BringForward"} side={"bottom"} sideOffset={5}>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleBold}
              className={cn(properties.fontWeight > 500 && "bg-gray-100")}
            >
              <FaBold className={"size-4"} />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center h-full justify-center">
          <Hint label={"Italic"} side={"bottom"} sideOffset={5}>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleItalic}
              className={cn(properties.fontStyle === "italic" && "bg-gray-100")}
            >
              <FaItalic className={"size-4"} />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center h-full justify-center">
          <FontSizeInput
            onChange={onChangeFontSize}
            value={properties.fontSize}
          />
        </div>
      )}
      <div className="flex items-center h-full justify-center">
        <Hint label={"BringForward"} side={"bottom"} sideOffset={5}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor?.bringForward()}
            className={cn(
              "p-2 rounded-md bg-transparent hover:bg-gray-100 active:bg-gray-200 transition duration-200 cursor-pointer",
            )}
          >
            <ArrowUp className={"size-4"} />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label={"sendBackwards"} side={"bottom"} sideOffset={5}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor?.sendBackwards()}
            className={cn(
              "p-2 rounded-md bg-transparent hover:bg-gray-100 active:bg-gray-200 transition duration-200 cursor-pointer",
            )}
          >
            <ArrowDown className={"size-4"} />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label={"sendBackwards"} side={"bottom"} sideOffset={5}>
          <Button variant="ghost" size="icon" onClick={() => editor?.delete()}>
            <Trash className={"size-4"} />
          </Button>
        </Hint>
      </div>
    </div>
  );
};

export default Toolbar;
