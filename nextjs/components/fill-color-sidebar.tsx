import { ActiveTool, Editor, FILL_COLOR } from "@/types";
import { cn } from "@/lib/utils";
import ToolSidebarHeader from "@/components/tool-sidebar-header";
import ToolSidebarClose from "@/components/tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import ColorPicker from "@/components/color-picker";

interface FillColorSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

const FillColorSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FillColorSidebarProps) => {
  const value = editor?.getActiveFillColor() || FILL_COLOR;
  const onClose = () => {
    onChangeActiveTool("select");
  };
  const onChange = (value: string) => {
    editor?.changeFillColor(value);
  };
  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "fill" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title={"Fill color"}
        description={"Add fill color to your element"}
      />
      <ScrollArea>
        <div className={"space-y-6-4 p-4"}>
          <ColorPicker value={value} onChange={onChange} />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export default FillColorSidebar;
