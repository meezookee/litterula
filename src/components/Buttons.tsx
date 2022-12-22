import { ReactNode } from "react";
import c from "classnames";
import styles from "./Button.module.css";

const Buttons = ({
  vertical,
  small,
  children,
}: {
  vertical?: boolean;
  small?: boolean;
  children?: ReactNode;
}) => (
  <div
    className={c(
      styles.buttons,
      vertical && styles.vertical,
      small && styles.small
    )}
  >
    {children}
  </div>
);

export default Buttons;
