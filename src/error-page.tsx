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
        <pre>{JSON.stringify(error, null, 2)}</pre>
      )}
    </div>
  );
};

export default ErrorPage;
