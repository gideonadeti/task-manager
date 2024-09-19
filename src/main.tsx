import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./index.css";
import Root from "./routes/Root";
import SignUp from "./routes/SignUp";
import SignIn from "./routes/SignIn";
import ErrorPage from "./components/ErrorPage";
import Index from "./routes/Index";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Index /> },
      {
        path: "/auth/sign-up",
        element: <SignUp />,
      },
      {
        path: "/auth/sign-in",
        element: <SignIn />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
