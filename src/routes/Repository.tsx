import { useParams } from "react-router-dom";
import { strict as assert } from "assert";
import styles from "./Repository.module.css";
import Explorer from "../components/Explorer";

const Repository = () => {
  const directory = useParams().repositoryName;
  assert(directory != null);

  return (
    <div className={styles.repository}>
      <Explorer path={directory} />
      <div>center</div>
      <div>right</div>
    </div>
  );
};

export default Repository;
