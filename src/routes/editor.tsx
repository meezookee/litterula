import { LoaderFunction, useLoaderData } from "react-router-dom";
import { pfs } from "../fs";
import { assert, assertNonNullable } from "../util";
import MarkdownEditor from "../components/MarkdownEditor";
import { parse, Node } from "../markdown";

export const loader: LoaderFunction = async ({
  params: { repositoryName, "*": path },
}) => {
  assertNonNullable(repositoryName);
  assertNonNullable(path);
  const data = await pfs.readFile(`/${repositoryName}/${path}`, {
    encoding: "utf8",
  });
  assert(typeof data === "string");
  const document = parse(data);
  return document;
};

const Editor = () => {
  const data = useLoaderData() as Node[];

  return <MarkdownEditor initialValue={data} />;
};

export default Editor;
