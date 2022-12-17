import c from "classnames";
import { ReactNode } from "react";
import styles from "./Button.module.css";

const Button = ({
  primary,
  ...props
}: {
  primary?: boolean;
  children?: ReactNode;
}) => (
  <button className={c(styles.button, primary && styles.primary)} {...props} />
);

export default Button;
