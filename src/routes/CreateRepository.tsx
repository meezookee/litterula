import Button from "../components/Button";
import Buttons from "../components/Buttons";
import Card from "../components/Card";
import TextInput from "../components/TextInput";
import styles from "./CreateRepository.module.css";

const CreateRepository = () => (
  <div className={styles["create-repository"]}>
    <Card
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, auto)",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <h1 style={{ gridColumn: "span 2" }}>Create a new repository</h1>
      <label htmlFor="repository-name" style={{ fontWeight: "bold" }}>
        Repository name
      </label>
      <TextInput id="repository-name" />
      <Buttons style={{ gridColumn: "2" }}>
        <Button primary>Create repository</Button>
      </Buttons>
    </Card>
  </div>
);

export default CreateRepository;
