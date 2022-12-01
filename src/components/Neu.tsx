import { ComponentPropsWithoutRef } from "react";
import c from "classnames";
import "./Neu.css";

const Neu = ({ className, ...props }: ComponentPropsWithoutRef<"div">) => (
  <div className={c("neu", className)} {...props} />
);

export const Buttons = ({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) => (
  <Neu className={c("buttons", className)} {...props} />
);

export default Neu;
