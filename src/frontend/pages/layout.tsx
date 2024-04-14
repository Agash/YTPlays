import { Outlet } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import { useAppSelector } from "../hooks/storeHooks";
import { initializeStore } from "../misc";

const Layout = () => {
  let loaded = useAppSelector((state) => state.config.loaded);
  initializeStore().then(() => {
    loaded = true;
  });

  loaded = true;

  if (!loaded)
    return (
      <div className="h-screen w-full bg-transparent rounded-md !overflow-visible relative flex flex-col items-center antialiased">
        <Spinner size="lg" />
      </div>
    );
  else
    return (
      <div className="h-screen w-full bg-transparent rounded-md !overflow-visible relative flex flex-col items-center antialiased">
        <Outlet />
      </div>
    );
};

export default Layout;
