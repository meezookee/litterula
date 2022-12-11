import { useEffect, useRef, useState } from "react";
import FS, { PromisifiedFS } from "@isomorphic-git/lightning-fs";
import styles from "./Repositories.module.css";
import Buttons from "../components/Buttons";
import Button from "../components/Button";
import Card from "../components/Card";

const Repositories = () => {
  const [repositoryNames, setRepositoryNames] = useState<string[]>([]);

  const fs = useRef<PromisifiedFS>();

  useEffect(() => {
    if (fs.current == null) {
      fs.current = new FS("litterula").promises;
    }
    fs.current.readdir("/").then(setRepositoryNames);
  }, []);

  return (
    <div className={styles["repositories"]}>
      <Card>
        <h1>Repositories</h1>
        <Buttons>
          {repositoryNames.map((repositoryName) => (
            <Button key={repositoryName} link to={repositoryName}>
              {repositoryName}
            </Button>
          ))}
          <Button link to="/create_repository">
            Create a new repository
          </Button>
        </Buttons>
      </Card>
    </div>
  );
};

export default Repositories;
