import { Options } from "@isomorphic-git/lightning-fs";
import { Button, Container, ListGroup, Stack } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { LoaderFunction, redirect } from "react-router-dom";
import * as git from "isomorphic-git";
import { pfs, fs } from "../fs";

export const loader: LoaderFunction = async () => {
  const repositoryNames = await pfs.readdir("/");
  if (repositoryNames.length === 0) {
    await git.init({ fs, dir: "/Untitled" });
    const data = `# Lorem ipsum

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
    await pfs.writeFile("/Untitled/Untitled.md", data);
    return redirect("/repositories/Untitled/Untitled.md");
  }
  if (repositoryNames.length === 1) {
    return redirect(`/repositories/${repositoryNames[0]}`);
  }
  return null;
};

const Root = () => (
  <Container>
    <Stack gap={3}>
      <h1>Litterula</h1>
      <ListGroup>
        <LinkContainer to="/repositories">
          <ListGroup.Item action>repositories</ListGroup.Item>
        </LinkContainer>
      </ListGroup>
      <Button
        onClick={() => {
          pfs.init("litterula", { wipe: true } as Options);
        }}
      >
        Wipe file system
      </Button>
    </Stack>
  </Container>
);

export default Root;
