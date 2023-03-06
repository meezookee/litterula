import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MarkdownEditor from "../components/MarkdownEditor";
import { Content, parse, serialize } from "../markdown";
import { openFile } from "../util";

const Editor = () => {
  const { repositoryName, "*": path } = useParams();
  const [value, setValue] = useState<Content[]>();
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle>();

  useEffect(() => {
    if (repositoryName == null || path == null) {
      return;
    }
    void (async () => {
      const rootDirectory = await navigator.storage.getDirectory();
      const repositoryDirectory = await rootDirectory.getDirectoryHandle(
        repositoryName
      );
      const handle = await openFile(repositoryDirectory, path);
      const file = await handle.getFile();
      const data = await file.text();
      const root = parse(data);

      setFileHandle(handle);
      setValue(root.children);
    })();
  }, [repositoryName, path]);

  const handleChange = useCallback(
    async (value: Content[]) => {
      if (fileHandle == null) {
        return;
      }
      try {
        const writable = await fileHandle.createWritable();
        await writable.write(serialize({ type: "root", children: value }));
        await writable.close();
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "NoModificationAllowedError"
        ) {
          return;
        }
        throw error;
      }
    },
    [fileHandle]
  );

  return !value ? null : (
    <MarkdownEditor value={value} onChange={handleChange} />
  );
};

export default Editor;
