import styles from "./Repositories.module.css";
import Buttons from "../components/Buttons";
import LinkButton from "../components/LinkButton";
import Card from "../components/Card";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { pfs } from "../fs";

export const loader: LoaderFunction = () => pfs.readdir("/");

const Repositories = () => {
  const repositoryNames = useLoaderData() as string[];

  return (
    <div className={styles["repositories"]}>
      <Card>
        <h1>Repositories</h1>
        <Buttons vertical>
          {repositoryNames.map((repositoryName) => (
            <LinkButton key={repositoryName} to={repositoryName}>
              {repositoryName}
            </LinkButton>
          ))}
          <LinkButton to="/create_repository">
            Create a new repository
          </LinkButton>
        </Buttons>
      </Card>
    </div>
  );
};

export default Repositories;
