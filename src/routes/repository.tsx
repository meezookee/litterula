import { Outlet, useMatch, useNavigate, useParams } from "react-router-dom";
import { PageLayout } from "@primer/react";
import { SubTreeState, TreeView } from "@primer/react/drafts";
import { useEffect, useState } from "react";
import * as Icon from "@primer/octicons-react";
import { arrayFromAsyncIterable, assert, assertNonNullable } from "../util";

const Repository = () => {
  const { repositoryName } = useParams();
  assert(repositoryName != null);

  const [directoryHandle, setDirectoryHandle] =
    useState<FileSystemDirectoryHandle>();

  useEffect(() => {
    navigator.storage
      .getDirectory()
      .then((directoryHandle) => setDirectoryHandle(directoryHandle))
      .catch((e) => {
        throw e;
      });
  }, []);

  return (
    <PageLayout>
      <PageLayout.Pane position="start">
        <Explorer directoryHandle={directoryHandle} />
      </PageLayout.Pane>
      <PageLayout.Content>
        <Outlet />
      </PageLayout.Content>
    </PageLayout>
  );
};

// TODO: Open directory when page is transitioned
const Explorer = ({
  directoryHandle,
}: {
  directoryHandle?: FileSystemDirectoryHandle;
}) => {
  const [handles, setHandles] = useState<FileSystemHandle[]>([]);

  useEffect(() => {
    if (directoryHandle == null) {
      return;
    }

    arrayFromAsyncIterable(directoryHandle.values())
      .then((handles) => setHandles(handles))
      .catch((e) => {
        throw e;
      });
  }, [directoryHandle]);

  return (
    <TreeView>
      {handles.map((handle) => (
        <Entry key={handle.name} handle={handle} />
      ))}
    </TreeView>
  );
};

const Entry = ({ handle }: { handle: FileSystemHandle }) => {
  if (handle instanceof FileSystemDirectoryHandle) {
    return <Directory handle={handle} />;
  } else if (handle instanceof FileSystemFileHandle) {
    return <File handle={handle} />;
  } else {
    throw new Error(`Unknown kind of FileSystemHandle ${handle.kind}`);
  }
};

const Directory = ({ handle }: { handle: FileSystemDirectoryHandle }) => {
  const [handles, setHandles] = useState<FileSystemHandle[]>([]);
  const [state, setState] = useState<SubTreeState>("initial");
  const [isExpanded, setExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      setState("loading");
      void arrayFromAsyncIterable(handle.values()).then((handles) => {
        setHandles(handles);
        setState("done");
      });
    } else {
      setState("initial");
      setHandles([]);
    }
  }, [handle, isExpanded]);

  return (
    <TreeView.Item id={handle.name} onExpandedChange={setExpanded}>
      <TreeView.LeadingVisual>
        {isExpanded ? (
          <Icon.FileDirectoryOpenFillIcon />
        ) : (
          <Icon.FileDirectoryFillIcon />
        )}
      </TreeView.LeadingVisual>
      {handle.name}
      <TreeView.SubTree state={state}>
        {handles.map((handle) => (
          <Entry key={handle.name} handle={handle} />
        ))}
      </TreeView.SubTree>
    </TreeView.Item>
  );
};

const File = ({ handle }: { handle: FileSystemFileHandle }) => {
  const [path, setPath] = useState<string>();
  const match = useMatch({ path: path ?? "", end: true });
  const navigate = useNavigate();

  useEffect(() => {
    void navigator.storage
      .getDirectory()
      .then((root) => root.resolve(handle))
      .then((entryNames) => {
        assertNonNullable(entryNames);
        setPath(`/repositories/${entryNames.join("/")}`);
      });
  }, [handle]);

  return (
    <TreeView.Item
      id={handle.name}
      current={match != null}
      onSelect={path ? () => navigate(path) : undefined}
    >
      <TreeView.LeadingVisual>
        <Icon.FileIcon />
      </TreeView.LeadingVisual>
      {handle.name}
    </TreeView.Item>
  );
};

export default Repository;
