import { LoaderFunction, useLoaderData } from "react-router-dom";
import { pfs } from "../fs";
import { assert, assertNonNullable } from "../util";
import EditorComponent from "../components/Editor";

export const loader: LoaderFunction = async ({
  params: { repositoryName, "*": path },
}) => {
  assertNonNullable(repositoryName);
  assertNonNullable(path);
  const data = await pfs.readFile(`/${repositoryName}/${path}`, {
    encoding: "utf8",
  });
  assert(typeof data === "string");
  return data;
};

const Editor = () => {
  const data = useLoaderData();
  assert(typeof data === "string");

  return data ? <EditorComponent initialValue={data} /> : null;
};

export default Editor;
