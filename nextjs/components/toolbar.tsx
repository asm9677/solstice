import { ActiveTool, Editor } from "@/types";
import { Button } from "@/components/ui/button";
import Hint from "@/components/hint";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

const Toolbar = ({ editor, activeTool, onChangeActiveTool }: ToolbarProps) => {
  const fillColor = editor?.getActiveFillColor();
  if (
    editor?.selectedObjects === null ||
    editor?.selectedObjects?.length === 0
  ) {
    return (
      <div className="shrink-0 border-b h-[56px] bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2" />
    );
  }
  return (
    <div className="shrink-0 border-b h-[56px] bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2">
      <div className="flex items-center h-full justify-center">
        <Hint label={"Color"} side={"bottom"} sideOffset={5}>
          <div
            onClick={() => onChangeActiveTool("fill")}
            className={cn(
              "p-2 rounded-md bg-transparent hover:bg-gray-100 active:bg-gray-200 transition duration-200 cursor-pointer",
              activeTool === "fill" && "bg-gray-100",
            )}
          >
            <div
              className={"rounded-sm size-4 border"}
              style={{
                backgroundColor: fillColor,
                width: 20,
                height: 20,
              }}
            ></div>
          </div>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
      </div>
    </div>
  );
};

export default Toolbar;
