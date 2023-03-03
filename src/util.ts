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

// what i really want is map function for async iterator tho
export async function arrayFromAsyncIterable<T>(
  iterator: AsyncIterable<T>
): Promise<T[]> {
  const values = [];
  for await (const value of iterator) {
    values.push(value);
  }
  return values;
}
