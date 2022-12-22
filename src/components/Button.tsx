import c from "classnames";
import { ReactNode } from "react";
import styles from "./Button.module.css";

const Button = ({
  primary,
  danger,
  children,
  ...props
}: {
  primary?: boolean;
  danger?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}) => (
  <button
    className={c(
      styles.button,
      primary && styles.primary,
      danger && styles.danger
    )}
    {...props}
  >
    {children}
  </button>
);

export default Button;
