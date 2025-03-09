import { ActiveTool, Editor } from "@/types";
import { cn } from "@/lib/utils";
import ToolSidebarHeader from "@/components/tool-sidebar-header";
import ToolSidebarClose from "@/components/tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface TemplateSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

const TemplateSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TemplateSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  const data = [
    "uncorked",
    "travelog",
    "garcia-gonzales",
    "jamie-wong",
    "shen-li",
    "alex-keller",
  ];
  const handleLoadTemplate = async (template: string) => {
    try {
      const response = await fetch(`/${template}.json`);
      if (!response.ok) {
        throw new Error("Failed to fetch JSON file");
      }
      const data = await response.json();
      console.log("handle load template");
      console.log({ editor });
      editor?.loadJson(JSON.stringify(data));
    } catch (error) {
      console.error("Error loading template:", error);
    }
  };
  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "templates" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title={"Templates"}
        description={"Choose from a template to get started"}
      />

      <ScrollArea className={"overflow-y-scroll"}>
        <div className={"p-4"}>
          <div className="grid gap-4">
            {data &&
              data.map((template) => (
                <button
                  key={template}
                  onClick={() => handleLoadTemplate(template)}
                  className={
                    "relative w-full h-[200px] group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
                  }
                >
                  <Image
                    fill
                    src={`/${template}.png`}
                    alt={template || "Template"}
                    className={"object-cover "}
                  />
                </button>
              ))}
          </div>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export default TemplateSidebar;
