import { ActionFunction, Form, redirect } from "react-router-dom";
import { strict as assert } from "assert";
import git from "isomorphic-git";
import SubmitButton from "../components/SubmitButton";
import Buttons from "../components/Buttons";
import Card from "../components/Card";
import TextInput from "../components/TextInput";
import styles from "./CreateRepository.module.css";
import { fs } from "../fs";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const repositoryName = formData.get("repository-name");
  assert(typeof repositoryName === "string");
  await git.init({ fs, dir: `/${repositoryName}` });
  return redirect(`/repositories/${repositoryName}`);
};

const CreateRepository = () => {
  return (
    <Form className={styles["create-repository"]} method="post">
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
        <TextInput id="repository-name" name="repository-name" />
        <div style={{ gridColumn: "2" }}>
          <Buttons>
            <SubmitButton primary>Create repository</SubmitButton>
          </Buttons>
        </div>
      </Card>
    </Form>
  );
};

export default CreateRepository;
