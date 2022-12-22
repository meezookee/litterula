import { useEffect, useState } from "react";
import c from "classnames";
import { Stats } from "@isomorphic-git/lightning-fs";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileDirectoryIcon,
  FileIcon,
  TrashIcon,
} from "@primer/octicons-react";
import { basename } from "@isomorphic-git/lightning-fs/src/path";
import { pfs } from "../fs";
import styles from "./Explorer.module.css";
import Buttons from "./Buttons";
import Button from "./Button";

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
    <div className={styles.explorer}>
      <div className={styles.header}>
        <div>{path}</div>
        <Buttons small>
          <Button>
            <FileIcon />
          </Button>
          <Button>
            <FileDirectoryIcon />
          </Button>
        </Buttons>
      </div>
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
  } else {
    return <File path={path} />;
  }
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
    <>
      <div
        className={styles.entry}
        tabIndex={0}
        onClick={() => setFolded((isFolded) => !isFolded)}
      >
        {isFolded ? <ChevronRightIcon /> : <ChevronDownIcon />}
        <span>{basename(path)}</span>
        <div className={styles.buttons}>
          <Buttons small>
            <Button>
              <FileIcon />
            </Button>
            <Button>
              <FileDirectoryIcon />
            </Button>
          </Buttons>
        </div>
      </div>
      <div className={c(styles.entries, isFolded && styles.hidden)}>
        {paths.map((path) => (
          <Entry key={path} path={path} />
        ))}
      </div>
    </>
  );
};

const File = ({ path }: { path: string }) => (
  <div className={styles.entry} tabIndex={0}>
    <FileIcon />
    <span>{basename(path)}</span>
    <div className={styles.buttons}>
      <Buttons small>
        <Button danger>
          <TrashIcon />
        </Button>
      </Buttons>
    </div>
  </div>
);

export default Explorer;
