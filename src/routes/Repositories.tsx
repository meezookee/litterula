import { Button, ButtonGroup } from "react-bootstrap";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { pfs } from "../fs";
import { LinkContainer } from "react-router-bootstrap";

export const loader: LoaderFunction = () => pfs.readdir("/");

const Repositories = () => {
  const repositoryNames = useLoaderData() as string[];

  return (
    <div>
      <h1>Repositories</h1>
      <ButtonGroup vertical>
        {repositoryNames.map((repositoryName) => (
          <LinkContainer key={repositoryName} to={repositoryName}>
            <Button>{repositoryName}</Button>
          </LinkContainer>
        ))}
        <LinkContainer to="/create_repository">
          <Button>Create a new repository</Button>
        </LinkContainer>
      </ButtonGroup>
    </div>
  );
};

export default Repositories;
