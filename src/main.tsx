import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ContextProvider } from "./store/context.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashBoard from "./app/pages/DashBoard.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // errorElement: <ErrorPage />,
    // loader: dashboardLoader,
    children: [
      {
        path: "/",
        element: <DashBoard />,
        index: true,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  </StrictMode>
);
