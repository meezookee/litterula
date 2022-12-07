import { ComponentPropsWithoutRef } from "react";
import styles from "./Buttons.module.css";

export const Buttons = (props: ComponentPropsWithoutRef<"div">) => (
  <div className={styles.buttons} {...props} />
);
