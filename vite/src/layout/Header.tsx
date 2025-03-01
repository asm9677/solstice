import { FC } from "react";
import { FaCrown } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { BsRecordCircleFill } from "react-icons/bs";
import { FaChartBar } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { IoShareOutline } from "react-icons/io5";
import { useLayoutContext } from "../context/LayoutContext";


const Header: FC = () => {
  return (
    <header className="flex items-center justify-between bg-[#1C1C26] border-b-[0.8px] border-[#2c2d3c] p-2 px-4 text-white">
      <div className="flex items-center space-x-4">
        <button className="text-lg font-bold">≡ 파일</button>
        <button className="flex items-center text-sm font-semibold">
          <FaCrown className="text-yellow-400 mr-1" /> 크기 조정
        </button>
        <button className="flex items-center text-sm font-semibold">
          <FiEdit3 className="mr-1" /> 편집 중 <IoIosArrowDown className="ml-1" />
        </button>
      </div>

      <div className="text-sm opacity-70">제목 없는 디자인 - 명함</div>

      <div className="flex items-center space-x-4">
        <button className="flex items-center text-sm font-semibold bg-purple-700 px-3 py-1 rounded-md">
          <FaCrown className="text-yellow-400 mr-1" /> 한 번 더 무료 체험하기
        </button>
        <button>
          <BsRecordCircleFill className="text-red-500 text-lg" />
        </button>
        <button>
          <FaChartBar className="text-lg" />
        </button>
        <button>
          <IoChatbubbleEllipsesOutline className="text-lg" />
        </button>
        <button>
          <FaShoppingCart className="text-lg" />
        </button>
        <button className="bg-purple-600 px-4 py-1 rounded-md flex items-center">
          <IoShareOutline className="mr-1" /> 공유
        </button>
      </div>
    </header>
  );
};

export default Header;
