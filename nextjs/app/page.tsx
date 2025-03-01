import { FC } from "react";
import { Canvas } from "@/components/canvas";
import { LayoutProvider } from "@/context/LayoutContext";
import Layout from "../components/layout/Layout";

const App: FC = () => {
  return (
    <>
      <LayoutProvider>
        <Canvas></Canvas>
        <Layout />
      </LayoutProvider>
    </>
  );
};

export default App;
