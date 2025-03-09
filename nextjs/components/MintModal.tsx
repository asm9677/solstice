import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { DialogOverlay } from "@radix-ui/react-dialog";
import Image from "next/image";

interface MintModalProps {
  mintModalOpen: boolean;
  setMintModalOpen: Dispatch<SetStateAction<boolean>>;
  imageUrl: string;
}

const MintModal: React.FC<MintModalProps> = ({
  mintModalOpen,
  setMintModalOpen,
  imageUrl,
}) => {
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [imagePath, setImagePath] = useState<string>("");

  useEffect(() => {
    if (imageUrl) {
      const newImagePath = imageUrl.replace("/uploads/", "");
      setImagePath(newImagePath);
    }
  }, [imageUrl]); // imageUrl이 변경될 때마다 effect 실행

  useEffect(() => {
    if (imagePath) {
      console.log("imagePath: ", imagePath); // imagePath가 업데이트된 후에 로그 찍기

      const img = new window.Image() as HTMLImageElement;
      img.src = `/api/images/${imagePath}`;
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
      };
    }
  }, [imagePath]);

  return (
    <Dialog open={mintModalOpen} onOpenChange={setMintModalOpen}>
      <DialogOverlay
        className="bg-transparent fixed inset-0 z-50"
        onClick={() => setMintModalOpen(false)}
      />
      <DialogTitle />
      <DialogContent className="bg-transparent p-0 m-0 overflow-hidden z-50">
        {imageSize ? (
          <Image
            src={`/api/images/${imagePath}`} // Next.js API를 통해 불러오기
            alt="Fetched Image"
            width={imageSize.width}
            height={imageSize.height}
            className="object-cover"
          />
        ) : (
          <p>Loading image...</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MintModal;
