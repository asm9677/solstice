"use client"
import { FC } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Main from "./Main";
import SidebarMenu from "./SidebarMenu";
import { useLayoutContext } from "../../context/LayoutContext";


const Layout: FC = () => {
  const { isSidebarOpen} = useLayoutContext();    
  // onClick={() => setIsSidebarOpen(!isSidebarOpen) }
  return (
    <>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-row w-full h-full" >
          <Sidebar />
          
          {isSidebarOpen && <SidebarMenu />}
          <Main />
          </div>
        </div>
      </>
  );
};

export default Layout;
