import type { Metadata } from "next";
import "./globals.css";
import { Inter, Karla, Quicksand, Lato } from "next/font/google";
import Providers from "@/components/providers";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
});
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400"],
});
const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata = {
  title: "Solstice – Create & Mint Your Digital NFT Design Asset",
  description:
    "Easily design and personalize your canvas on Solana. A seamless, fast, and secure way to share your professional identity on-chain.",
  openGraph: {
    title: "Solstice – Create & Mint Your Digital NFT Design Asset",
    url: "https://solstice-two.vercel.app",
    siteName: "Easily design and personalize your canvas on Solana.",
    images: [
      {
        url: "/thumbnail.png", // 도메인 루트에 올려야 함
        width: 1200,
        height: 630,
        alt: "Solstice",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solstice – Create & Mint Your Digital NFT Design Asset",
    images: ["/thumbnail.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable}  ${karla.variable} ${quicksand.variable} ${lato.variable} antialiased `}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
