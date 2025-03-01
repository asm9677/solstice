import React, { FC, useRef, useState } from "react";
import { useLayoutContext } from "../context/LayoutContext";
import ImageUploader from "./ImageUploader";


interface NavButtonProps {
    img:React.JSX.Element,
    text:any,
    index :any,
}

const SidebarButton:FC<NavButtonProps> = ({
  img ,
  text,
  index,
}) => {
  const { isSidebarOpen, setIsSidebarOpen, selectedButton, setSelectedButton } = useLayoutContext();  
  const uploaderRef = useRef<{ handleUpload: () => void } | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 이미지 선택 시 실행될 콜백 함수
  const handleFileSelect = (file: File | null, previewUrl: string | null) => {
    if (file) {
      console.log("선택된 파일:", file);
      setSelectedImage(previewUrl);
    }
  };

  
  return (
      <>
        <button
          className={`w-16 h-16 p-1 flex flex-col gap-0.5 justify-center items-center text-[#ababc0] hover:text-white leading-tight ${
            selectedButton == index && isSidebarOpen && "bg-[#272836]"
          }`}
        onClick={() => {
            if (index == 4) {
              uploaderRef.current?.handleUpload()
            }
          
            if (index >= 3) {
              return
            }
            else if (selectedButton != index) setIsSidebarOpen(true);
            else if (selectedButton == index) setIsSidebarOpen(!isSidebarOpen);

            setSelectedButton(index);
        }}
        >
            {img}
        <span className="text-[10px]">{text}</span>
      </button>
       <ImageUploader ref={uploaderRef} onFileSelect={handleFileSelect} />
      </>
    );
};

export default SidebarButton;