import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider, Spinner } from "@primer/react";
import "./index.css";
import ErrorPage from "./error-page";
import Root, { loader as rootLoader } from "./routes/root";
import Repository from "./routes/repository";
import Editor from "./routes/editor";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      loader: rootLoader,
    },
    {
      path: "/repositories/:repositoryName",
      element: <Repository />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "*",
          element: <Editor />,
          errorElement: <ErrorPage />,
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL }
);

const root = ReactDOM.createRoot(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.getElementById("root")!
);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} fallbackElement={<Spinner />} />
    </ThemeProvider>
  </React.StrictMode>
);
