import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { pfs } from "../fs";
import { assert, assertNonNullable } from "../util";

const Editor = () => {
  const [data, setData] = useState<string>();
  const { repositoryName, "*": path } = useParams();
  assertNonNullable(repositoryName);
  assertNonNullable(path);

  useEffect(() => {
    pfs
      .readFile(`/${repositoryName}/${path}`, { encoding: "utf8" })
      .then((data) => {
        assert(typeof data === "string");
        setData(data);
      });
  }, [path, repositoryName]);

  return <pre>{data}</pre>;
};

export default Editor;
