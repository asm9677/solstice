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

export const metadata: Metadata = {
  title: "Solstice",
  description: "Solana app for business cards",
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
