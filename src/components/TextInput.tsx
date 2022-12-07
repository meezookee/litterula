import { ComponentPropsWithoutRef } from "react";
import styles from "./TextInput.module.css";

const TextInput = (props: ComponentPropsWithoutRef<"input">) => (
  <input className={styles["text-input"]} type="input" {...props} />
);

export default TextInput;
