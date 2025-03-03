import React from "react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export interface HintProps {
  label: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
}

const Hint = ({
  children,
  label,
  sideOffset,
  alignOffset,
  side,
  align,
}: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent
          className={"text-white bg-slate-800 border-slate-800"}
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
        >
          <p className={"font-semibold capitalize"}>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
export default Hint;
