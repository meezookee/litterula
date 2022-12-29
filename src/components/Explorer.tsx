import { ReactNode, useEffect, useState } from "react";
import { Stats } from "@isomorphic-git/lightning-fs";
import { basename } from "@isomorphic-git/lightning-fs/src/path";
import * as Icon from "@primer/octicons-react";
import { NavList } from "@primer/react";
import { Link, To, useMatch, useResolvedPath } from "react-router-dom";
import { pfs } from "../fs";

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
    <NavList>
      {paths.map((path) => (
        <Entry key={path} path={path} />
      ))}
    </NavList>
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
      <NavList.Item onClick={() => setFolded((isFolded) => !isFolded)}>
        <NavList.LeadingVisual>
          <Icon.FileDirectoryIcon />
        </NavList.LeadingVisual>
        {basename(path)}
        <NavList.SubNav>
          {paths.map((path) => (
            <Entry key={path} path={path} />
          ))}
        </NavList.SubNav>
      </NavList.Item>
    </>
  );
};

const File = ({ path }: { path: string }) => (
  <NavItem to={`/repositories${path}`}>
    <NavList.LeadingVisual>
      <Icon.FileIcon />
    </NavList.LeadingVisual>
    {basename(path)}
  </NavItem>
);

const NavItem = ({ to, children }: { to: To; children: ReactNode }) => {
  const resolved = useResolvedPath(to);
  const isCurrent = useMatch({ path: resolved.pathname, end: true });
  return (
    <NavList.Item
      as={Link}
      to={to}
      aria-current={isCurrent ? "page" : undefined}
    >
      {children}
    </NavList.Item>
  );
};

export default Explorer;
