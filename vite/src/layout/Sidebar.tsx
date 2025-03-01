import { FC, useState } from "react";

import Elements from "../components/SidebarIcon/Elements";
import Recording from "../components/SidebarIcon/Recording";
import Contents from "../components/SidebarIcon/Contents";
import Template from "../components/SidebarIcon/Template";
import Text from "../components/SidebarIcon/Text";
import SidebarButton from "../components/SidebarButton";

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
    img: <Recording />,
    text: "배경",
  },
  {
    img: <Text />,
    text: "텍스트",
  },
  {
    img: <Contents />,
    text: "사진, QR",
  },
];

const Sidebar: FC = () => {  
  return (
    <>
      <div className="w-[70px] h-full text-[#ababc0] bg-[#1C1C26]">
        {buttons.map((v,i) => <SidebarButton key={i} img={v.img} text={v.text} index={i} />)}
      </div>
    </>
  );
};

export default Sidebar;
