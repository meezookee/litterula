import { Outlet } from "react-router-dom";
import styles from "./Root.module.css";

const Root = () => {
  return (
    <div className={styles.root}>
      <Outlet />
    </div>
  );
};

export default Root;
