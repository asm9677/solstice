import {FC} from "react";

import { LayoutProvider } from "./context/LayoutContext";
import Layout from "./layout/Layout";

const App:FC = () => {
  return (
    <>
      <LayoutProvider>
        <Layout />
      </LayoutProvider>
    </>
  );
};

export default App;
