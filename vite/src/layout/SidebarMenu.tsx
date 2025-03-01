import { FC } from "react";
import { useLayoutContext } from "../context/LayoutContext";
import TemplateMenu from "../components/TemplateMenu";
import ElementMenu from "../components/ElementMenu";
import BackgroundMenu from "../components/BackgroundMenu";

const SidebarMenu: FC = () => {
  const { selectedButton } = useLayoutContext();  
  return (    
      <div className="min-w-[300px]  h-full bg-[#272836]">
        {selectedButton == 0 && <TemplateMenu />}
        {selectedButton == 1 && <ElementMenu />}
        {selectedButton == 2 && <BackgroundMenu />}
      </div>    
  );
};

export default SidebarMenu;
