import { FC } from "react";
import { useLayoutContext } from "../context/LayoutContext";
import TemplateMenu from "../components/TemplateMenu";
import ElementMenu from "../components/ElementMenu";

const SidebarMenu: FC = () => {
  const { selectedButton } = useLayoutContext();  
  return (    
      <div className="min-w-[300px]  h-full bg-[#272836]">
        {selectedButton == 0 && <TemplateMenu />}
        {selectedButton == 1 && <ElementMenu />}
      </div>    
  );
};

export default SidebarMenu;
