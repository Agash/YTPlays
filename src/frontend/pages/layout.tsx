import { Outlet } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import { useAppSelector } from "../hooks/storeHooks";
import { initializeStore } from "../misc";

const Layout = () => {
  initializeStore();

  return (
    <div className="h-screen w-full bg-transparent rounded-md !overflow-visible relative flex flex-col items-center antialiased">
      <Outlet />
    </div>
  );
};

export default Layout;
