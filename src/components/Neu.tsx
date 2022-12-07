import { ReactNode } from "react";
import styles from "./Neu.module.css";

export const Neu = ({ children }: { children: ReactNode[] }) => (
  <div className={styles.neu}>{children}</div>
);

export default Neu;
