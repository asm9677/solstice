"use client";
import {
  ChevronDown,
  Download,
  LogOut,
  MousePointerClick,
  WalletMinimal,
  Trash2,
  Upload,
} from "lucide-react";
import { useFilePicker } from "use-file-picker";
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
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { ActiveTool, Editor } from "@/types";
import { cn } from "@/lib/utils";
import bs58 from "bs58";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface NavbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  isSaved: boolean;
  onChangeActiveTool: (activeTool: ActiveTool) => void;
}

const SOLANA_NETWORK = "devnet"; // 네트워크 설정 (devnet, testnet, mainnet-beta)

const Navbar = ({
  editor,
  isSaved,
  activeTool,
  onChangeActiveTool,
}: NavbarProps) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { openFilePicker } = useFilePicker({
    accept: ".json",
    onFilesSuccessfullySelected: ({ plainFiles }: any) => {
      if (plainFiles && plainFiles.length > 0) {
        const file = plainFiles[0];
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = () => {
          editor?.loadJson(reader.result as string);
        };
      }
    },
  });

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

  const getCanvasHash = async (blob: Blob): Promise<string> => {
    const arrayBuffer = await blob.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashHex = Buffer.from(hashBuffer).toString("hex");
    return hashHex;
  };

  const onClickMint = async () => {
    const blob = editor?.mintImage();
    const hash = await getCanvasHash(blob!);
    const encodedHash = new TextEncoder().encode(hash);

    const signedMessage = await window.solana?.signMessage(encodedHash, "utf8");

    const formData = new FormData();
    const file = new File([blob!], "card.png", { type: blob!.type });
    formData.append("image", file);
    if (walletAddress) {
      formData.append("address", walletAddress);
    }
    if (signedMessage) {
      const signatureBs58 = bs58.encode(signedMessage.signature);
      formData.append("signature", signatureBs58);
    }
    formData.append("hash", hash);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
        method: "POST",
        body: formData, // FormData 전송
      });

      const data = await response.json();
      console.log("서버 응답:", data);
    } catch (error) {
      console.error("파일 업로드 실패:", error);
    }
  };
  return (
    <nav className="flex w-full items-center p-4 h-[68px] gap-x-8 border-b lg:pl-[34px]">
      <Logo className={"w-28 h-16 relative shrink-0"} />

      <div className="w-full flex items-center gap-x-1 h-full">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center text-sm">
              File
              <ChevronDown className="ml-2 size-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={"start"} className={"min-w-60"}>
            <DropdownMenuItem onClick={() => openFilePicker()}>
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
            className={cn(
              "p-2 rounded-md bg-transparent hover:bg-gray-100 active:bg-gray-200 transition duration-200 cursor-pointer",
              activeTool === "select" && "bg-gray-100",
            )}
            onClick={() => onChangeActiveTool("select")}
          >
            <MousePointerClick className={"size-4"} />
          </div>
        </Hint>{" "}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Hint
              label={"Remove all and reset"}
              side={"bottom"}
              sideOffset={10}
            >
              <div
                className={cn(
                  "p-2 rounded-md bg-transparent hover:bg-gray-100 active:bg-gray-200 transition duration-200 cursor-pointer",
                )}
              >
                <Trash2 className={"size-4"} color={"red"} />
              </div>
            </Hint>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action will remove all objects from the canvas. This cannot
              be undone.
            </DialogDescription>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  editor?.reset();
                  setOpen(false);
                }}
              >
                Yes, Reset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Separator orientation={"vertical"} className={"mx-2"} />
        <div className="flex items-center gap-x-2">
          {isSaved ? (
            <>
              <BsCloudCheck className={"size-[20px] text-green-500"} />
              <div className="text-xs text-muted-foreground">Saved</div>
            </>
          ) : (
            <>
              <BsCloudSlash className={"size-[20px] text-red-500"} />
              <div className="text-xs text-muted-foreground">Saving...</div>
            </>
          )}
        </div>
        <div className="ml-auto flex items-center gap-x-4">
          {walletAddress && (
            <Hint
              label="Upload image on Solana network"
              side="bottom"
              sideOffset={5}
            >
              <Button onClick={onClickMint}>
                Mint <Upload className={"size-4"} />
              </Button>
            </Hint>
          )}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <div className="flex items-center text-sm">
                Export
                <Download className={"size-4 ml-4"} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={"end"} className={"min-w-60"}>
              <DropdownMenuItem
                className={"flex items-center gap-x-2"}
                onClick={() => editor?.saveJson()}
              >
                <CiFileOn className="size-8" />
                <div>
                  <p>JSON</p>
                  <p className={"text-xs text-muted-foreground"}>
                    Save for later editing
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={"flex items-center gap-x-2"}
                onClick={() => editor?.saveImage("png")}
              >
                <CiFileOn className="size-8" />
                <div>
                  <p>PNG</p>
                  <p className={"text-xs text-muted-foreground"}>
                    Best for sharing on the web
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={"flex items-center gap-x-2"}
                onClick={() => editor?.saveImage("svg")}
              >
                <CiFileOn className="size-8" />
                <div>
                  <p>SVG</p>
                  <p className={"text-xs text-muted-foreground"}>
                    Best for editing in vector software
                  </p>
                </div>
              </DropdownMenuItem>{" "}
              <DropdownMenuItem
                className={"flex items-center gap-x-2"}
                onClick={() => editor?.saveImage("webp")}
              >
                <CiFileOn className="size-8" />
                <div>
                  <p>WebP</p>
                  <p className={"text-xs text-muted-foreground"}>
                    Best for quality & compression
                  </p>
                </div>
              </DropdownMenuItem>{" "}
              <DropdownMenuItem
                className={"flex items-center gap-x-2"}
                onClick={() => editor?.saveImage("jpg")}
              >
                <CiFileOn className="size-8" />
                <div>
                  <p>JPG</p>
                  <p className={"text-xs text-muted-foreground"}>
                    Best for printing
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
