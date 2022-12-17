import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import ErrorPage from "./error-page";
import Root from "./routes/Root";
import Index from "./routes/Index";
import Repositories, {
  loader as repositoriesLoader,
} from "./routes/Repositories";
import CreateRepository, {
  action as createRepositoryAction,
} from "./routes/CreateRepository";
import Repository from "./routes/Repository";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Index /> },
      {
        path: "/repositories",
        element: <Repositories />,
        loader: repositoriesLoader,
      },
      {
        path: "/repositories/:repositoryName",
        element: <Repository />,
      },
      {
        path: "/create_repository",
        element: <CreateRepository />,
        action: createRepositoryAction,
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
    <RouterProvider router={router} />
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
