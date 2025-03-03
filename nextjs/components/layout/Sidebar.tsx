import { FC } from "react";
//
// import Elements from "../SidebarIcon/Elements";
// import Recording from "../SidebarIcon/Recording";
// import Contents from "../SidebarIcon/Contents";
// import Template from "../SidebarIcon/Template";
// import Text from "../SidebarIcon/Text";
// import SidebarButton from "../SidebarButton";

// const buttons = [
//   {
//     img: <Template />,
//     text: "템플릿",
//   },
//   {
//     img: <Elements />,
//     text: "요소",
//   },
//   {
//     img: <Recording />,
//     text: "배경",
//   },
//   {
//     img: <Text />,
//     text: "텍스트",
//   },
//   {
//     img: <Contents />,
//     text: "사진, QR",
//   },
// ];

const Sidebar: FC = () => {
  return (
    <aside className="bg-white flex flex-col w-[100px] h-full border-r overflow-y-auto"></aside>
  );
};

export default Sidebar;
