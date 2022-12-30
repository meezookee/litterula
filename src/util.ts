export function assert<T>(condition: T): asserts condition {
  if (!condition) {
    throw new Error(`${condition} == true`);
  }
}

export function assertNonNullable<T>(arg: T): asserts arg is NonNullable<T> {
  if (arg == null) {
    throw new Error(`${arg} != null`);
  }
}
