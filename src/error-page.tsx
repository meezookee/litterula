import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div>
      <h1>Error</h1>
      {isRouteErrorResponse(error) ? (
        <p>{error.statusText}</p>
      ) : (
        <pre style={{ whiteSpace: "pre-wrap" }}>{String(error)}</pre>
      )}
    </div>
  );
};

export default ErrorPage;
