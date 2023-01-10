import {
  ActionFunction,
  LoaderFunction,
  useLoaderData,
  useLocation,
  useParams,
  useSubmit,
} from "react-router-dom";
import { pfs } from "../fs";
import { assert, assertNonNullable } from "../util";
import MarkdownEditor from "../components/MarkdownEditor";
import { Content, parse, serialize } from "../markdown";

export const loader: LoaderFunction = async ({
  params: { repositoryName, "*": path },
}) => {
  assertNonNullable(repositoryName);
  assertNonNullable(path);
  const data = await pfs.readFile(`/${repositoryName}/${path}`, {
    encoding: "utf8",
  });
  assert(typeof data === "string");
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
  await pfs.writeFile(`/${repositoryName}/${path}`, data, {
    mode: 0o755,
    encoding: "utf8",
  });
  return null;
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
