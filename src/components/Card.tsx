import { ComponentPropsWithoutRef } from "react";
import styles from "./Card.module.css";

const Card = (props: ComponentPropsWithoutRef<"div">) => (
  <div className={styles.card} {...props} />
);

export default Card;
