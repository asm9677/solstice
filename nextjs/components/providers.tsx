"use client";
import QueryProvider from "@/components/query-provider";

interface ProviderProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProviderProps) => {
  return <QueryProvider>{children}</QueryProvider>;
};

export default Providers;
