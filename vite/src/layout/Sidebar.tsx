import { FC, useState } from "react";
import { useLayoutContext } from "../context/LayoutContext";

import Elements from "../components/SidebarButton/Elements";
import Recording from "../components/SidebarButton/Recording";
import Contents from "../components/SidebarButton/Contents";
import Template from "../components/SidebarButton/Template";
import Text from "../components/SidebarButton/Text";
import SidebarButton from "../components/SidebarButton/SidebarButton";

const buttons = [
  {
    img: <Template />,
    text: "템플릿",
  },
  {
    img: <Elements />,
    text: "요소",
  },  
  {
    img: <Text />,
    text: "텍스트",
  },
  {
    img: <Contents />,
    text: "사진, QR",
  },
  {
    img: <Recording />,
    text: "배경",
  },
];

const Sidebar: FC = () => {
  // const { isSidebarOpen, setIsSidebarOpen } = useLayoutContext();    
  
  const [selectedButton, setSelectedButton] = useState(0);
    // 
  return (
    <>
      <div className="w-[70px] h-full text-[#ababc0] bg-[#1C1C26]">
        {buttons.map((v,i) => <SidebarButton key={i} img={v.img} text={v.text} index={i} selectedButton={selectedButton} setSelectedButton={setSelectedButton}  />)}
      </div>
    </>
  );
};

export default Sidebar;
