import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import MarkdownEditor from "../components/MarkdownEditor";
import { Content, parse, serialize } from "../markdown";

const Editor = () => {
  const { repositoryName, "*": path } = useParams();
  const [value, setValue] = useState<Content[]>();
  const fileHandle = useRef<FileSystemFileHandle>();

  useEffect(() => {
    if (repositoryName == null || path == null) {
      return;
    }
    void (async () => {
      const fs = await navigator.storage.getDirectory();
      const repositoryDirectory = await fs.getDirectoryHandle(repositoryName);
      const entryNames = path.split("/");
      let current = repositoryDirectory;
      for (const entryName of entryNames.slice(0, -1)) {
        current = await current.getDirectoryHandle(entryName);
      }
      fileHandle.current = await current.getFileHandle(
        entryNames[entryNames.length - 1]
      );
      const file = await fileHandle.current.getFile();
      const data = await file.text();
      const root = parse(data);

      setValue(root.children);
    })();
  }, [repositoryName, path]);

  const handleChange = useCallback(async (value: Content[]) => {
    if (fileHandle.current == null) {
      return;
    }
    try {
      const writable = await fileHandle.current.createWritable();
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
  }, []);

  return !value ? null : (
    <MarkdownEditor value={value} onChange={handleChange} />
  );
};

export default Editor;
