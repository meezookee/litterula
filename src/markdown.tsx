import type * as AST from "mdast";
import type * as Unist from "unist";
import { fromMarkdown } from "mdast-util-from-markdown";

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

export const parse = (source: string) =>
  convertRoot(fromMarkdown(source), source);

const convertRoot = (root: AST.Root, source: string): Modified<AST.Root> => ({
  type: "root",
  children: root.children.map((child) => convertContent(child, source)),
});

// FIXME: Type it right. I believe implementation is correct.
const convertContent = <T extends AST.Content>(
  content: T,
  source: string
): Modified<T> => {
  if ("value" in content) {
    return { ...content, text: content.value } as unknown as Modified<T>;
  }

  if ("children" in content) {
    return {
      ...content,
      children: content.children.map((child) => convertContent(child, source)),
    } as unknown as Modified<T>;
  }

  return {
    ...content,
    children: [{ text: "" }],
  } as unknown as Modified<T>;
};
