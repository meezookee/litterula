import type * as AST from "mdast";
import type * as Unist from "unist";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toMarkdown } from "mdast-util-to-markdown";

type Rename<T, K1 extends keyof T, K2 extends string> = Omit<T, K1> & {
  [key in K2]: T[K1];
};

type ReplaceType<T, K extends keyof T, V> = Omit<T, K> & { [key in K]: V };

type Modified<T> = T extends AST.Literal
  ? Rename<T, "value", "text">
  : T extends AST.Parent
  ? ReplaceType<T, "children", Modified<T["children"][0]>[]>
  : T extends Unist.Node
  ? T & { children: [{ text: "" }] }
  : never;

export type Text = Modified<AST.Text>;

export type Content = Modified<AST.Content>;

export const parse = (source: string) => fromRoot(fromMarkdown(source), source);

const fromRoot = (root: AST.Root, source: string): Modified<AST.Root> => ({
  type: "root",
  children: root.children.map((child) => fromContent(child, source)),
});

// FIXME: Type it right. I believe implementation is correct.
const fromContent = <T extends AST.Content>(
  content: T,
  source: string
): Modified<T> => {
  if ("value" in content) {
    const { value: text, ...rest } = content;
    return { ...rest, text } as Modified<T>;
  }

  if ("children" in content) {
    return {
      ...content,
      children: content.children.map((child) => fromContent(child, source)),
    } as Modified<T>;
  }

  return {
    ...content,
    children: [{ text: "" }],
  } as Modified<T>;
};

export const serialize = (ast: Modified<AST.Root>): string =>
  toMarkdown(intoRoot(ast));

const intoRoot = (ast: Modified<AST.Root>): AST.Root => ({
  type: "root",
  children: ast.children.map(intoContent),
});

const intoContent = <T extends AST.Content>(content: Modified<T>): T => {
  if ("text" in content) {
    const { text: value, ...rest } = content;
    return { ...rest, value } as unknown as T;
  }

  if ("children" in content) {
    return {
      ...content,
      children: content.children.map(
        intoContent as (content: unknown) => unknown
      ),
    } as T;
  }

  return content as T;
};
