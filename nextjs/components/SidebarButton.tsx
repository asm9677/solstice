"use client"
import React, { FC, useRef, useState } from "react";
import { useLayoutContext } from "../context/LayoutContext";
import ImageUploader from "./ImageUploader";
import { useWalletContext } from "@/context/WalletContext";
import bs58 from "bs58"; 

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
  const {walletAddress, setWalletAddress} = useWalletContext();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getFileHash = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    return Buffer.from(hashBuffer).toString("hex"); // Hex 변환
  };

  // 이미지 선택 시 실행될 콜백 함수
  const handleFileSelect = async (file: File | null) => {    
    if (!file) return;

    console.log("선택된 파일:", file);
    const hash = await getFileHash(file);
    console.log("파일 해시:", hash);

    const encodedHash = new TextEncoder().encode(hash);

    // 3️⃣ Phantom 지갑으로 서명
    const signedMessage = await window.solana?.signMessage(encodedHash, "utf8");
    console.log("서명된 메시지:", signedMessage);
    
    const formData = new FormData();
    formData.append("image", file); 
    if (walletAddress) {
      formData.append("address", walletAddress);
    }
    if (signedMessage) {
      const signatureBs58 = bs58.encode(signedMessage.signature);
      console.log("서명된 메시지:", signatureBs58);
      formData.append("signature", signatureBs58);
    }
    formData.append("hash", hash);

    try {
      const response = await fetch("http://141.164.44.11:5000/api/image/upload", {
        // const response = await fetch("http://localhost:5000/api/image/upload", {
        method: "POST",
        body: formData, // FormData 전송
      });

      const data = await response.json();
      console.log("서버 응답:", data);

      if (data.url) {
        setSelectedImage(data.url); // 업로드된 이미지 URL로 상태 업데이트
      }
    } catch (error) {
      console.error("파일 업로드 실패:", error);
    }
  };


  
  return (
      <>
        <button
          className={`w-16 h-16 p-1 flex flex-col gap-0.5 justify-center items-center text-[#ababc0] hover:text-white leading-tight cursor-pointer ${
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