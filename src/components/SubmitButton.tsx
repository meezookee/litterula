import c from "classnames";
import { ReactNode } from "react";
import styles from "./Button.module.css";

const SubmitButton = (props: { primary?: boolean; children?: ReactNode }) => (
  <button
    className={c(styles.button, props.primary && styles.primary)}
    type="submit"
  >
    {props.children}
  </button>
);

export default SubmitButton;
