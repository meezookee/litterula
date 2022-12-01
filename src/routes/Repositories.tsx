import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import FS, { PromisifiedFS } from "@isomorphic-git/lightning-fs";
import assert from "assert";
import "./Repositories.css";
import Neu, { Buttons } from "../components/Neu";

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
    <div className="repositories">
      <Neu style={{ padding: "2rem", minWidth: "40rem" }}>
        <h1>Repositories</h1>
        <Buttons>
          {repositoryNames.map((repositoryName) => (
            <Link key={repositoryName} to={repositoryName} className="button">
              {repositoryName}
            </Link>
          ))}
          <button
            className="button"
            disabled={fs.current == null}
            onClick={async () => {
              assert(fs.current != null);
              await fs.current.mkdir("/foo");
            }}
          >
            Create a new repository
          </button>
        </Buttons>
      </Neu>
    </div>
  );
};

export default Repositories;
