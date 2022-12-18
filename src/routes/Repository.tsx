import { useParams } from "react-router-dom";
import { strict as assert } from "assert";
import { useEffect, useState } from "react";
import { Stats } from "@isomorphic-git/lightning-fs";
import { pfs } from "../fs";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileIcon,
} from "@primer/octicons-react";
import styles from "./Repository.module.css";

const Repository = () => {
  const directory = useParams().repositoryName;
  assert(directory != null);

  return (
    <div className={styles.repository}>
      <Explorer path={directory} />
      <div>center</div>
      <div>right</div>
    </div>
  );
};

const Explorer = ({ path }: { path: string }) => {
  const [paths, setPaths] = useState<string[]>([]);

  useEffect(() => {
    pfs
      .readdir(`/${path}`)
      .then((relpaths) =>
        setPaths(relpaths.map((relpath) => `/${path}/${relpath}`))
      );
  }, [path]);

  return (
    <div>
      <h1>Explorer</h1>
      <div>{path}</div>
      <div>
        {paths.map((path) => (
          <Entry key={path} path={path} />
        ))}
      </div>
    </div>
  );
};

const Entry = ({ path }: { path: string }) => {
  const [stats, setStats] = useState<Stats | undefined>();

  useEffect(() => {
    pfs.lstat(path).then(setStats);
  }, [path]);

  if (stats?.isDirectory()) {
    return <Directory path={path} />;
  }
  return (
    <div>
      <FileIcon />
      <span>{path}</span>
    </div>
  );
};

const Directory = ({ path }: { path: string }) => {
  const [paths, setPaths] = useState<string[]>([]);
  const [isFolded, setFolded] = useState(true);

  useEffect(() => {
    if (isFolded) {
      pfs
        .readdir(path)
        .then((relpaths) =>
          setPaths(relpaths.map((relpath) => `${path}/${relpath}`))
        );
    }
  }, [path, isFolded]);

  return (
    <div>
      <div onClick={() => setFolded((isFolded) => !isFolded)}>
        {isFolded ? <ChevronRightIcon /> : <ChevronDownIcon />}
        <span>{path}</span>
      </div>
      {!isFolded && (
        <div className={styles.entries}>
          {paths.map((path) => (
            <Entry key={path} path={path} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Repository;
