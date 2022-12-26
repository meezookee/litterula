import { ActionFunction, Form as RouterForm, redirect } from "react-router-dom";
import { strict as assert } from "assert";
import git from "isomorphic-git";
import { Button, Form } from "react-bootstrap";
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
    <RouterForm method="post">
      <h1>Create a new repository</h1>
      <Form.Group>
        <Form.Label>Repository name</Form.Label>
        <Form.Control type="text" name="repository-name" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Create repository
      </Button>
    </RouterForm>
  );
};

export default CreateRepository;
