import type { ActiveTool, Editor } from "@/types";
import { cn } from "@/lib/utils";
import ToolSidebarHeader from "@/components/tool-sidebar-header";
import ToolSidebarClose from "@/components/tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import ShapeTool from "@/components/shape-tool";
import { FaCircle, FaSquare, FaSquareFull } from "react-icons/fa";
import { IoTriangle } from "react-icons/io5";
import { FaDiamond } from "react-icons/fa6";

interface ShapeSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

const ShapeSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ShapeSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };
  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "shapes" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title={"Shape"}
        description={"Add shapes to your canvas"}
      />
      <ScrollArea>
        <div className={"grid grid-cols-3 gap-4 p-4"}>
          <ShapeTool icon={FaCircle} onClick={() => editor?.addCircle()} />
          <ShapeTool
            icon={FaSquare}
            onClick={() => editor?.addSoftRectangle()}
          />
          <ShapeTool
            icon={FaSquareFull}
            onClick={() => editor?.addRectangle()}
          />
          <ShapeTool icon={IoTriangle} onClick={() => editor?.addTriangle()} />
          <ShapeTool
            icon={IoTriangle}
            iconClassName={"rotate-180"}
            onClick={() => {
              editor?.addInverseTriangle();
            }}
          />
          <ShapeTool
            icon={FaDiamond}
            onClick={() => {
              editor?.addDiamond();
            }}
          />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export default ShapeSidebar;
