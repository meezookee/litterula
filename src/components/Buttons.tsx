import { ComponentPropsWithoutRef } from "react";
import styles from "./Buttons.module.css";

const Buttons = (props: ComponentPropsWithoutRef<"div">) => (
  <div className={styles.buttons} {...props} />
);

export default Buttons;
