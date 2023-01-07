import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider, Spinner } from "@primer/react";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import ErrorPage from "./error-page";
import Root, { loader as rootLoader } from "./routes/root";
import Repository from "./routes/repository";
import Editor, { loader as editorLoader } from "./routes/editor";

const router = createBrowserRouter([
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
        loader: editorLoader,
      },
    ],
  },
]);

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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
