import { FC } from "react";

const TemplateMenu: FC = () => {
    return (    
        <div className="w-full h-full text-[14px] text-white p-4 pb-0 pr-1 font-bold flex-col">
            Card Template
          
            <div className="w-full h-[calc(100vh-110px)] overflow-y-auto mt-6 pr-4"> 
                {
                    Array.from({ length: 10 }).fill(0).map((v,i) => 
                        <div
                            key={i}
                            className="w-full aspect-[9/5] inline-flex relative cursor-pointer border border-gray-200 transition duration-400 box-border my-2 bg-[url('https://cdn.ohprint.me/design/template/thumbnail/045020122015/crystal_TP_bc_9x5_55003_122015_20220429104941818_9823.png')] bg-cover"
                        >
                        </div>                        
                    )                    
                }
            </div>
        </div>    
    );
};

export default TemplateMenu;
