"use client";
import React, { createContext, useContext, useState } from "react";

// 컨텍스트 초기 상태 정의
interface LayoutContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
  selectedButton: number;
  setSelectedButton: (selectedButton: number) => void;
}

// 컨텍스트 생성
const LayoutContext = createContext<LayoutContextType | null>(null);

// 컨텍스트 프로바이더 컴포넌트
export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState(0);

  return (
    <LayoutContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        selectedButton,
        setSelectedButton,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

// 컨텍스트 사용을 위한 커스텀 훅
export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context)
    throw new Error("useLayoutContext must be used within a LayoutProvider");
  return context;
};
