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
