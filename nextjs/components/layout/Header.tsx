"use client";

import { FC, useEffect, useState } from "react";
import { FaCrown } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { BsRecordCircleFill } from "react-icons/bs";
import { FaChartBar } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { LuUpload } from "react-icons/lu";
import { MdAccountBalanceWallet, MdSaveAlt } from "react-icons/md";
import ExpandIcon from "../SidebarIcon/ExpandIcon";
import { useLayoutContext } from "@/context/LayoutContext";
import { useWalletContext } from "@/context/WalletContext";

const SOLANA_NETWORK = "devnet"; // 네트워크 설정 (devnet, testnet, mainnet-beta)

const Header: FC = () => {
  const {walletAddress, setWalletAddress} = useWalletContext();
  const {isSidebarOpen, setIsSidebarOpen} = useLayoutContext();

  const connectWallet = async () => {
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        console.log("✅ Phantom 지갑이 감지되었습니다.");
        const response = await solana.connect({ onlyIfTrusted: false });

        console.log(response.publicKey.toString());
        setWalletAddress(response.publicKey.toString());
      } else {
        alert("Phantom 지갑을 설치해주세요!");
      }
    } catch (error) {
      console.error("지갑 확인 중 오류 발생:", error);
    }
  };

  // 🔌 3. 연결 해제하기
  const disconnectWallet = () => {
    setWalletAddress(null);
    console.log("🚫 지갑 연결이 해제되었습니다.");
  };

  useEffect(() => {
    // checkIfWalletIsConnected();
  }, []);

  return (
    <header className="flex items-center justify-between bg-[#1C1C26] border-b-[0.8px] border-[#2c2d3c] p-2 px-4 text-white">
      <div className="flex items-center space-x-4">
        <button
          className="mr-9 text-[#ABABC0] hover:text-white relative cursor-pointer"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <ExpandIcon />
          {/* {clickedSubMenu && (
            <div className="absolute top-9 z-50">
              <Menu width={280} subMenu={subMenu}></Menu>
            </div>
          )} */}
        </button>
      </div>

      <div className="flex items-center space-x-4 text-[18px] ">
        {walletAddress ? (
          <>
            <button className="h-8 px-3 py-[5px] mr-2 bg-[#272836] rounded-[4px] font-semibold border-[0.8px] border-[#272836] flex items-center hover:bg-[#3B3B4F] ">
              <MdAccountBalanceWallet />
              <span className="ml-[6px] mr-1 text-[14px]">
                {walletAddress.slice(0, 4)}..{walletAddress.slice(-4)}
              </span>
            </button>
            <button className="h-8 px-3 py-[5px] mr-2 bg-[#272836] rounded-[4px] font-semibold border-[0.8px] border-[#272836] flex items-center hover:bg-[#3B3B4F] ">
              <MdSaveAlt />
              <span className="ml-[6px] mr-1 text-[14px]">임시 저장</span>
            </button>
            <button className="h-8 px-3 py-[5px] bg-[#4D43DE] hover:bg-[#6352E4] rounded-[4px] font-semibold border-[0.8px] border-[#272836] flex items-center  ">
              <LuUpload />
              <span className="ml-[6px] mr-1 text-[14px]">업로드</span>
            </button>
          </>
        ) : (
          <>
            <button
              className="h-8 px-3 py-[5px] bg-[#4D43DE] hover:bg-[#6352E4] rounded-[4px] font-semibold border-[0.8px] border-[#272836] flex items-center"
              onClick={connectWallet}
            >
              <span className="ml-[6px] mr-1 text-[14px]">Connect Wallet</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
