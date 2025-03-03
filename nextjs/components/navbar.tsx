"use client";
import {
  ChevronDown,
  Download,
  LogOut,
  MousePointerClick,
  Redo2,
  Undo2,
  WalletMinimal,
} from "lucide-react";
import Logo from "@/components/logo";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { CiFileOn } from "react-icons/ci";
import Hint from "@/components/hint";
import { BsCloudCheck } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

const SOLANA_NETWORK = "devnet"; // 네트워크 설정 (devnet, testnet, mainnet-beta)

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState<String | null>(null);

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
    <nav className="flex w-full items-center p-4 h-[68px] gap-x-8 border-b lg:pl-[34px]">
      <Logo />

      <div className="w-full flex items-center gap-x-1 h-full">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center text-sm">
              File
              <ChevronDown className="ml-2 size-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={"start"} className={"min-w-60"}>
            <DropdownMenuItem>
              <CiFileOn className="size-8" />
              <div>
                <p>Open</p>
                <p className={"text-xs text-muted-foreground"}>
                  Open a Json File
                </p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator orientation={"vertical"} className={"mx-2"} />
        <Hint label={"Select"} side={"bottom"} sideOffset={10}>
          <div
            className="p-2 rounded-md bg-transparent hover:bg-gray-100 active:bg-gray-200 transition duration-200 cursor-pointer"
            onClick={() => {}}
          >
            <MousePointerClick className={"size-4"} />
          </div>
        </Hint>
        <Hint label={"Undo"} side={"bottom"} sideOffset={10}>
          <div
            className="p-2 rounded-md bg-transparent hover:bg-gray-100 active:bg-gray-200 transition duration-200 cursor-pointer"
            onClick={() => {}}
          >
            <Undo2 className={"size-4"} />
          </div>
        </Hint>
        <Hint label={"Redo"} side={"bottom"} sideOffset={10}>
          <div
            className="p-2 rounded-md bg-transparent hover:bg-gray-100 active:bg-gray-200 transition duration-200 cursor-pointer"
            onClick={() => {}}
          >
            <Redo2 className={"size-4"} />
          </div>
        </Hint>
        <Separator orientation={"vertical"} className={"mx-2"} />
        <div className="flex items-center gap-x-2">
          <BsCloudCheck className={"size-[20px] text-muted-foreground"} />
          <div className="text-xs text-muted-foreground">Saved</div>
        </div>
        <div className="ml-auto flex items-center gap-x-4">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <div className="flex items-center text-sm">
                Export
                <Download className={"size-4 ml-4"} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={"end"} className={"min-w-60"}>
              <DropdownMenuItem className={"flex items-center gap-x-2"}>
                <CiFileOn className="size-8" />
                <div>
                  <p>JSON</p>
                  <p className={"text-xs text-muted-foreground"}>
                    Save for later editing
                  </p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {walletAddress ? (
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>
                  <div className="flex items-center gap-x-2">
                    <WalletMinimal /> {walletAddress.slice(0, 4)}..
                    {walletAddress.slice(-4)}
                  </div>
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <div
                      className={"w-full flex items-center justify-between"}
                      onClick={disconnectWallet}
                    >
                      Disconnect
                      <LogOut />
                    </div>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          ) : (
            <Button variant={"outline"} onClick={connectWallet}>
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
