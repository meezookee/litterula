import { strict as assert } from "assert";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { pfs } from "../fs";

const Editor = () => {
  const [data, setData] = useState<string>();
  const { repositoryName, "*": path } = useParams();
  assert(repositoryName != null && path != null);

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
