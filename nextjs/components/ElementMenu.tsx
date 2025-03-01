import { FC } from "react";

const ElementMenu: FC = () => {
    return (    
        <div className="w-full h-full text-[14px] text-white p-4  font-bold flex-col">
            <span>Line</span>
          
            <div className="w-full mt-2 grid grid-cols-4 gap-6 cursor-pointer h-[70px] items-center"> 
                
                <div className="h-0.5 bg-white"></div>          
                <div className="border-t-2 border-dashed border-white"></div>
                <div className="border-t-2 border-dotted border-white"></div>
                <div className="flex items-center ">
                    <div className="w-full h-0.5 bg-white"></div>
                    <div className="w-0 h-0 border-l-8 border-l-white border-y-4 border-y-transparent"></div>
                </div>
            </div>

            <span>Shape</span>
          
            <div className="w-full mt-4 grid grid-cols-4 cursor-pointer items-center gap-4">
                <div className="w-[60px] h-[60px] bg-white"></div>
                <div className="w-[60px] h-[60px] bg-white rounded-lg"></div>
                <div className="w-[60px] h-[60px] bg-white rounded-full"></div>
                <div className="flex justify-center items-center w-[60px] h-[60px]">
                    <div className="w-0 h-0 border-l-[32px] border-l-transparent 
                                    border-r-[32px] border-r-transparent 
                                    border-b-[56px] border-b-white"></div>
                </div>
            </div>
        </div>    
    );
};

export default ElementMenu;
