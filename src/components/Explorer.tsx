import { useEffect, useState } from "react";
import { Stats } from "@isomorphic-git/lightning-fs";
import { basename } from "@isomorphic-git/lightning-fs/src/path";
import * as Icon from "@primer/octicons-react";
import { ActionList, Box } from "@primer/react";
import { Link, useMatch } from "react-router-dom";
import { pfs } from "../fs";

// TODO: Open directory when page is transitioned
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
    <ActionList>
      {paths.map((path) => (
        <Entry key={path} path={path} depth={0} />
      ))}
    </ActionList>
  );
};

const Entry = ({ path, depth }: { path: string; depth: number }) => {
  const [stats, setStats] = useState<Stats | undefined>();

  useEffect(() => {
    pfs.lstat(path).then(setStats);
  }, [path]);

  if (stats?.isDirectory()) {
    return <Directory path={path} depth={depth} />;
  } else {
    return <File path={path} depth={depth} />;
  }
};

const Directory = ({ path, depth }: { path: string; depth: number }) => {
  const [paths, setPaths] = useState<string[]>([]);
  const [isOpen, setOpen] = useState(false);
  const match = useMatch({ path: `/repositories${path}`, end: false });

  useEffect(() => {
    if (isOpen) {
      pfs
        .readdir(path)
        .then((relpaths) =>
          setPaths(relpaths.map((relpath) => `${path}/${relpath}`))
        );
    }
  }, [path, isOpen]);

  return (
    <>
      <ActionList.Item
        onClick={() => setOpen((isOpen) => !isOpen)}
        active={!isOpen && match != null}
        sx={{ paddingLeft: `${8 + 16 * depth}px` }}
      >
        <ActionList.LeadingVisual>
          <Icon.FileDirectoryIcon />
        </ActionList.LeadingVisual>
        {basename(path)}
        <ActionList.TrailingVisual>
          {isOpen ? <Icon.ChevronUpIcon /> : <Icon.ChevronDownIcon />}
        </ActionList.TrailingVisual>
      </ActionList.Item>
      <Box as="ul" sx={{ padding: 0, display: isOpen ? "block" : "none" }}>
        {paths.map((path) => (
          <Entry key={path} path={path} depth={depth + 1} />
        ))}
      </Box>
    </>
  );
};

const File = ({ path, depth }: { path: string; depth: number }) => {
  const to = `/repositories${path}`;
  const match = useMatch({ path: to, end: true });

  return (
    <ActionList.LinkItem
      as={Link}
      to={to}
      active={match != null}
      sx={{ paddingLeft: `${8 + 16 * depth}px` }}
    >
      <ActionList.LeadingVisual>
        <Icon.FileIcon />
      </ActionList.LeadingVisual>
      {basename(path)}
    </ActionList.LinkItem>
  );
};

export default Explorer;
