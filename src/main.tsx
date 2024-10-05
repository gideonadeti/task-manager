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
import { Main } from "./components/Main";
import GoogleRedirect from "./routes/GoogleRedirect";
import TaskPage from "./components/TaskPage";

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
      {
        path: "/task-groups/:taskGroupId",
        element: <Main />,
      },
      {
        path: "/auth/google-redirect",
        element: <GoogleRedirect />,
      },
      {
        path: "/task-groups/:taskGroupId/tasks/:taskId",
        element: <TaskPage />
      }
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
