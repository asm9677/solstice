import { ActiveTool, Editor, fonts } from "@/types";
import { cn } from "@/lib/utils";
import ToolSidebarHeader from "@/components/tool-sidebar-header";
import ToolSidebarClose from "@/components/tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface FontSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

const FontSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FontSidebarProps) => {
  const value = editor?.getActiveFontFamily();
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "font" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader title={"Font"} description={"Change the text font"} />
      <ScrollArea className={"overflow-y-scroll"}>
        <div className={"space-y-1 p-4"}>
          {fonts.map((font) => (
            <Button
              key={font}
              variant={"secondary"}
              size={"lg"}
              className={cn(
                "w-full h-16 justify-start text-left",
                value === font && "border-2 border-blue-500",
              )}
              style={{
                fontFamily: font,
                fontSize: "16px",
                padding: "8px 16px",
              }}
              onClick={() => {
                editor?.changeFontFamily(font);
              }}
            >
              {font}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export default FontSidebar;
