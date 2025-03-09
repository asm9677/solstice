import { ActiveTool, Editor, FILL_COLOR } from "@/types";
import { cn } from "@/lib/utils";
import ToolSidebarHeader from "@/components/tool-sidebar-header";
import ToolSidebarClose from "@/components/tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import ColorPicker from "@/components/color-picker";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface SettingSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

const SettingsSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: SettingSidebarProps) => {
  const workspace = editor?.getWorkspace();
  const initialWidth = useMemo(() => `${workspace?.width ?? 0}`, [workspace]);
  const initialHeight = useMemo(() => `${workspace?.height ?? 0}`, [workspace]);
  const initialBackground = useMemo(
    () => workspace?.fill ?? "#FFFFFF",
    [workspace],
  );
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [background, setBackground] = useState(initialBackground);

  useEffect(() => {
    setWidth(initialWidth);
    setHeight(initialHeight);
    setBackground(initialBackground);
  }, [initialWidth, initialHeight, initialBackground]);

  const changeWidth = (value: string) => {
    setWidth(value);
  };

  const changeHeight = (value: string) => {
    setHeight(value);
  };

  const changeBackground = (value: string) => {
    setBackground(value);
    editor?.changeBackground(value);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editor?.changeSize({ width: Number(width), height: Number(height) });
  };
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "settings" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title={"Settings"}
        description={"Change workspace settings"}
      />
      <ScrollArea>
        <form action="" className="space-y-4 p-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label>Height</Label>
            <Input
              placeholder={"Height"}
              value={height}
              type={"number"}
              onChange={(e) => changeHeight(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Width</Label>
            <Input
              placeholder={"Width"}
              value={width}
              type={"number"}
              onChange={(e) => changeWidth(e.target.value)}
            />
          </div>
          <Button type={"submit"} className={"w-full"}>
            Resize
          </Button>
        </form>
        <div className="p-4">
          <ColorPicker
            value={background as string}
            onChange={changeBackground}
          />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export default SettingsSidebar;
