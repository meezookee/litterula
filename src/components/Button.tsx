import { ComponentPropsWithoutRef } from "react";
import { Link, LinkProps } from "react-router-dom";
import c from "classnames";
import styles from "./Button.module.css";

const Button = (
  props: { primary?: boolean } & (
    | ({ link: true } & LinkProps)
    | ({ link?: false } & ComponentPropsWithoutRef<"span">)
  )
) => {
  const className = c(styles.button, props.primary && styles.primary);
  if (props.link) {
    const { link: _, ...linkProps } = props;
    return <Link className={className} {...linkProps} />;
  } else {
    const { link: _, ...spanProps } = props;
    return <span className={className} {...spanProps} />;
  }
};

export default Button;
