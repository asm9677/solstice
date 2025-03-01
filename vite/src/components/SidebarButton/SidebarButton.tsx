import React, { FC, useEffect, useState } from "react";
import { useLayoutContext } from "../../context/LayoutContext";


interface NavButtonProps {
    img:React.JSX.Element,
    text:any,
    index :any,
    selectedButton:any,
    setSelectedButton:any,
}

const SidebarButton:FC<NavButtonProps> = ({
  img ,
  text,
  index,
  selectedButton,
  setSelectedButton,
}) => {
    const { isSidebarOpen, setIsSidebarOpen } = useLayoutContext();  
    
  useEffect(() => {
    console.log(index, selectedButton)
  }, [selectedButton])
    return (
        <button
          className={`w-16 h-16 p-1 flex flex-col gap-0.5 justify-center items-center text-[#ababc0] hover:text-white leading-tight ${
            selectedButton == index && isSidebarOpen && "bg-[#272836]"
          }`}
        onClick={() => {
            if (selectedButton != index) setIsSidebarOpen(true);
            else if (selectedButton == index) setIsSidebarOpen(!isSidebarOpen);

            setSelectedButton(index);
        }}
        >
            {img}
        <span className="text-[10px]">{text}</span>
        </button>
    );
};

export default SidebarButton;