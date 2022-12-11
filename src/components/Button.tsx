import { ComponentPropsWithoutRef } from "react";
import { Link, LinkProps } from "react-router-dom";
import styles from "./Button.module.css";

const Button = (
  props:
    | ({ link: true } & LinkProps)
    | ({ link?: false } & ComponentPropsWithoutRef<"span">)
) => {
  if (props.link) {
    const { link: _, ...linkProps } = props;
    return <Link className={styles.button} {...linkProps} />;
  } else {
    const { link: _, ...divProps } = props;
    return <span className={styles.button} {...divProps} />;
  }
};

export default Button;
