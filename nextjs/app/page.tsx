"use client";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = () => {
  return (
    <div className="relative w-full h-screen flex justify-center text-2xl font-bold overflow-hidden">
      <div className={"hero-bg"}></div>
      <div className="hero-content overflow-y-scroll w-full pb-[280px]">
        <div className="text-white text-2xl font-bold">
          <div className="flex flex-col items-center justify-center mt-[200px] items-center gap-4">
            <Logo className="w-[310px] h-[208px] relative" />
            <div className="mt-auto flex flex-col items-center gap-4 font-[family-name:var(--font-karla)]">
              <div className={"text-center text-4xl leading-relaxed"}>
                <h1 className={"text-[48px] mb-[24px]"}>
                  Create and mint canvas artwork on Solana
                </h1>
                <p>With a simple and intuitive canvas tool</p>
                <p>to craft and securely store your NFT on-chain. </p>
                <p
                  className={
                    "flex gap-x-2 justify-center font-bold text-gray-950 "
                  }
                >
                  Experience 100 times faster speed and low cost
                </p>
                through parallel processing technology.
              </div>
              <Link href={"/editor"}>
                <Button
                  className={
                    "text-4xl py-8 px-6 mt-[150px] rounded-lg font-bold"
                  }
                >
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
