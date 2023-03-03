import {
  ActionFunction,
  LoaderFunction,
  useLoaderData,
  useLocation,
  useParams,
  useSubmit,
} from "react-router-dom";
import { assert, assertNonNullable } from "../util";
import MarkdownEditor from "../components/MarkdownEditor";
import { Content, parse, serialize } from "../markdown";

export const loader: LoaderFunction = async ({
  params: { repositoryName, "*": path },
}) => {
  assertNonNullable(repositoryName);
  assertNonNullable(path);
  const fs = await navigator.storage.getDirectory();
  const repositoryDirectory = await fs.getDirectoryHandle(repositoryName);
  const entryNames = path.split("/");
  let current = repositoryDirectory;
  for (const entryName of entryNames.slice(0, -1)) {
    current = await current.getDirectoryHandle(entryName);
  }
  const fileHandle = await current.getFileHandle(
    entryNames[entryNames.length - 1]
  );
  const file = await fileHandle.getFile();
  const data = await file.text();
  const root = parse(data);
  return root.children;
};

export const action: ActionFunction = async ({
  params: { repositoryName, "*": path },
  request,
}) => {
  assertNonNullable(repositoryName);
  assertNonNullable(path);
  const formData = await request.formData();
  const data = formData.get("value");
  assert(typeof data === "string");

  const fs = await navigator.storage.getDirectory();
  const repositoryDirectory = await fs.getDirectoryHandle(repositoryName);
  const entryNames = path.split("/");
  let current = repositoryDirectory;
  for (const entryName of entryNames.slice(0, -1)) {
    current = await current.getDirectoryHandle(entryName);
  }
  const fileHandle = await current.getFileHandle(
    entryNames[entryNames.length - 1]
  );
  try {
    const writable = await fileHandle.createWritable();
    await writable.write(data);
    await writable.close();
  } catch (e) {
    if (e instanceof DOMException) {
      if (e.name === "NoModificationAllowedError") {
        return false;
      }
    }
    throw e;
  }
  return true;
};

const Editor = () => {
  const { "*": path } = useParams();
  const data = useLoaderData() as Content[];
  const submit = useSubmit();
  const location = useLocation();

  assertNonNullable(path);

  return (
    <MarkdownEditor
      value={data}
      onChange={(data) =>
        submit(
          { value: serialize({ type: "root", children: data }) },
          {
            method: "post",
            action: location.pathname,
            encType: "multipart/form-data",
          }
        )
      }
    />
  );
};

export default Editor;
