import { Outlet, useMatch, useNavigate, useParams } from "react-router-dom";
import { PageLayout } from "@primer/react";
import { TreeView } from "@primer/react/drafts";
import { useEffect, useState } from "react";
import { Stats } from "@isomorphic-git/lightning-fs";
import { basename } from "@isomorphic-git/lightning-fs/src/path";
import * as Icon from "@primer/octicons-react";
import { pfs } from "../fs";
import { assert } from "../util";

const Repository = () => {
  const { repositoryName } = useParams();
  assert(repositoryName != null);

  return (
    <PageLayout>
      <PageLayout.Pane position="start">
        <Explorer path={repositoryName} />
      </PageLayout.Pane>
      <PageLayout.Content>
        <Outlet />
      </PageLayout.Content>
    </PageLayout>
  );
};

// TODO: Open directory when page is transitioned
const Explorer = ({ path }: { path: string }) => {
  const [paths, setPaths] = useState<string[]>([]);

  useEffect(() => {
    void pfs
      .readdir(`/${path}`)
      .then((relpaths) =>
        setPaths(relpaths.map((relpath) => `/${path}/${relpath}`))
      );
  }, [path]);

  return (
    <TreeView>
      {paths.map((path) => (
        <Entry key={path} path={path} />
      ))}
    </TreeView>
  );
};

const Entry = ({ path }: { path: string }) => {
  const [stats, setStats] = useState<Stats | undefined>();

  useEffect(() => {
    void pfs.lstat(path).then(setStats);
  }, [path]);

  if (stats?.isDirectory()) {
    return <Directory path={path} />;
  } else {
    return <File path={path} />;
  }
};

const Directory = ({ path }: { path: string }) => {
  const [paths, setPaths] = useState<string[]>([]);
  const [isExpanded, setExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      void pfs
        .readdir(path)
        .then((relpaths) =>
          setPaths(relpaths.map((relpath) => `${path}/${relpath}`))
        );
    } else {
      setPaths([]);
    }
  }, [path, isExpanded]);

  return (
    <TreeView.Item id={path} onExpandedChange={setExpanded}>
      <TreeView.LeadingVisual>
        {isExpanded ? (
          <Icon.FileDirectoryOpenFillIcon />
        ) : (
          <Icon.FileDirectoryFillIcon />
        )}
      </TreeView.LeadingVisual>
      {basename(path)}
      <TreeView.SubTree>
        {paths.map((path) => (
          <Entry key={path} path={path} />
        ))}
      </TreeView.SubTree>
    </TreeView.Item>
  );
};

const File = ({ path }: { path: string }) => {
  const to = `/repositories${path}`;
  const match = useMatch({ path: to, end: true });
  const navigate = useNavigate();

  return (
    <TreeView.Item
      id={path}
      current={match != null}
      onSelect={() => navigate(to)}
    >
      <TreeView.LeadingVisual>
        <Icon.FileIcon />
      </TreeView.LeadingVisual>
      {basename(path)}
    </TreeView.Item>
  );
};

export default Repository;
