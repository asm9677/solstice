"use client"
import React, { createContext, useContext, useState } from "react";

// 컨텍스트 초기 상태 정의
interface WalletContextType {
    walletAddress : string | null,
    setWalletAddress: (walletAddress: string | null) => void;
}

// 컨텍스트 생성
const WalletContext = createContext<WalletContextType | null>(null);

// 컨텍스트 프로바이더 컴포넌트
export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  return (
    <WalletContext.Provider value={{ walletAddress, setWalletAddress }}>
      {children}
    </WalletContext.Provider>
  );
};

// 컨텍스트 사용을 위한 커스텀 훅
export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWalletContext must be used within a LayoutProvider");
  return context;
};
