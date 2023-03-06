export function assert<T>(condition: T): asserts condition {
  if (!condition) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`${condition} == true`);
  }
}

export function assertNonNullable<T>(arg: T): asserts arg is NonNullable<T> {
  if (arg == null) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`${arg} != null`);
  }
}

export async function arrayFromAsyncIterable<T>(
  iterator: AsyncIterable<T>
): Promise<T[]> {
  const values = [];
  for await (const value of iterator) {
    values.push(value);
  }
  return values;
}

export async function openFile(
  directory: FileSystemDirectoryHandle,
  path: string
): Promise<FileSystemFileHandle> {
  const entryNames = path.split("/");
  return (
    await entryNames
      .slice(0, -1)
      .reduce(
        async (directory, entryName) =>
          (await directory).getDirectoryHandle(entryName),
        Promise.resolve(directory)
      )
  ).getFileHandle(entryNames[entryNames.length - 1]);
}
