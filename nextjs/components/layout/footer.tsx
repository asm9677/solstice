import { Button } from "@/components/ui/button";
import Hint from "@/components/hint";
import { Minimize, ZoomIn, ZoomOut } from "lucide-react";
import { Editor } from "@/types";

interface FooterProps {
  editor: Editor | undefined;
}

const Footer = ({ editor }: FooterProps) => (
  <footer
    className={
      "h-[52px] border-t bg-white w-full flex items-center overflow-x-auto z-[49] gap-x-1 shrink-0 px-4 flex-row-reverse"
    }
  >
    <Hint label={"Zoom in"} side={"top"} sideOffset={10}>
      <Button
        onClick={() => {
          editor?.autoZoom();
        }}
        size="icon"
        variant={"ghost"}
        className={"h-full"}
      >
        <Minimize />
      </Button>
    </Hint>
    <Hint label={"Zoom in"} side={"top"} sideOffset={10}>
      <Button
        onClick={() => {
          editor?.zoomIn();
        }}
        size="icon"
        variant={"ghost"}
        className={"h-full"}
      >
        <ZoomIn />
      </Button>
    </Hint>
    <Hint label={"Zoom Out"} side={"top"} sideOffset={10}>
      <Button
        onClick={() => {
          editor?.zoomOut();
        }}
        size="icon"
        variant={"ghost"}
        className={"h-full"}
      >
        <ZoomOut />
      </Button>
    </Hint>
  </footer>
);

export default Footer;
