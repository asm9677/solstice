import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

import { cn } from "@/lib/utils";

interface ShapeToolProps {
  onClick: () => void;
  icon: LucideIcon | IconType;
  iconClassName?: string;
}

const ShapeTool = ({ icon: Icon, iconClassName, onClick }: ShapeToolProps) => {
  return (
    <button>
      <Icon className={cn("h-full w-full", iconClassName)} onClick={onClick} />
    </button>
  );
};
export default ShapeTool;
