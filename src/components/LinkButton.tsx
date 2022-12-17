import { Link, LinkProps } from "react-router-dom";
import c from "classnames";
import styles from "./Button.module.css";

const LinkButton = ({
  primary,
  ...props
}: { primary?: boolean } & LinkProps) => (
  <Link className={c(styles.button, primary && styles.primary)} {...props} />
);

export default LinkButton;
