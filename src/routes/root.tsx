import { Box } from "@primer/react";
import { Link, LoaderFunction, redirect } from "react-router-dom";
import { arrayFromAsyncIterable } from "../util";

export const loader: LoaderFunction = async () => {
  const rootDirectoryHandle = await navigator.storage.getDirectory();
  const repositoryNames = await arrayFromAsyncIterable(
    rootDirectoryHandle.keys()
  );
  if (repositoryNames.length === 0) {
    const untitledRepositoryDirectoryHandle =
      await rootDirectoryHandle.getDirectoryHandle("Untitled", {
        create: true,
      });
    const data = `# Lorem ipsum

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

----

Hello, world! *Italic*, **Bold**!

- Foo
- Bar
    - Baz

> Those were the days!
> Nvm it sucked
>
> Again, it sucked

Bye!
`;
    const fileHandle = await untitledRepositoryDirectoryHandle.getFileHandle(
      "Untitled.md",
      { create: true }
    );
    const writable = await fileHandle.createWritable();
    await writable.write(data);
    return redirect("/repositories/Untitled/Untitled.md");
  }
  if (repositoryNames.length === 1) {
    return redirect(`/repositories/${repositoryNames[0]}`);
  }
  return null;
};

const Root = () => (
  <Box>
    <Box>
      <h1>Litterula</h1>
      <Box>
        <Link to="/repositories">repositories</Link>
      </Box>
    </Box>
  </Box>
);

export default Root;
