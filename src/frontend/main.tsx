// main.tsx or main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import { RouterProvider, createHashRouter } from "react-router-dom";
import Layout from "./pages/layout";
import RunPage from "./pages/run";
import ConfigPage from "./pages/config";
import { Provider } from "react-redux";
import store from "./stores/store";
import ErrorPage from "./pages/error";

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <ConfigPage />,
      },
      {
        path: "run",
        element: <RunPage displayInfobox={false} />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <NextUIProvider>
        <RouterProvider router={router} />
      </NextUIProvider>
    </Provider>
  </React.StrictMode>
);
