import {FC} from "react";

import { LayoutProvider } from "../context/LayoutContext";
import Layout from "../components/layout/Layout";
import { WalletProvider } from "@/context/WalletContext";

const App:FC = () => {
  return (
    <>
      <WalletProvider>
        <LayoutProvider>
          <Layout />
        </LayoutProvider>
      </WalletProvider>
    </>
  );
};

export default App;
