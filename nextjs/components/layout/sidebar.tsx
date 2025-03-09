import { FC } from "react";
import SidebarItem from "@/components/sidebar-item";
import type { ActiveTool } from "@/types";
import {
  LayoutTemplate,
  ImageIcon,
  Pencil,
  Settings,
  Shapes,
} from "lucide-react";

// import Elements from "../SidebarIcon/Elements";
// import Recording from "../SidebarIcon/Recording";
// import Contents from "../SidebarIcon/Contents";
// import Template from "../SidebarIcon/Template";
// import Text from "../SidebarIcon/Text";
// import SidebarButton from "../SidebarButton";
import type { LucideIcon } from "lucide-react";

interface SidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  tool: ActiveTool;
}

const list: SidebarItemProps[] = [
  {
    icon: LayoutTemplate,
    label: "Design",
    tool: "templates",
  },
  {
    icon: ImageIcon,
    label: "Image",
    tool: "images",
  },
  {
    icon: Pencil,
    label: "Text",
    tool: "text",
  },
  {
    icon: Shapes,
    label: "Shapes",
    tool: "shapes",
  },
  {
    icon: Settings,
    label: "Settings",
    tool: "settings",
  },
];

const Sidebar = ({ activeTool, onChangeActiveTool }: SidebarProps) => {
  return (
    <aside className="bg-white flex flex-col w-[100px] h-full border-r overflow-y-auto">
      <div className="flex flex-col">
        {list.map((el) => (
          <SidebarItem
            key={el.label}
            icon={el.icon}
            label={el.label}
            onClick={() => onChangeActiveTool(el.tool)}
            isActive={activeTool === el.tool}
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
