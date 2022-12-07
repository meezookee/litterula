import Card from "../components/Card";
import TextInput from "../components/TextInput";
import styles from "./CreateRepository.module.css";

const CreateRepository = () => (
  <div className={styles["create-repository"]}>
    <Card>
      <h1>Create a new repository</h1>
      <label>
        Repository name
        <TextInput />
      </label>
    </Card>
  </div>
);

export default CreateRepository;
