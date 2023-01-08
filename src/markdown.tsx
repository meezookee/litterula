import type * as AST from "mdast";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toMarkdown } from "mdast-util-to-markdown";

export type Text = Modified<AST.Text>;
export type Content = Modified<AST.Content>;

type Rename<T, K1 extends keyof T, K2 extends string> = Omit<T, K1> & {
  [key in K2]: T[K1];
};
type ReplaceType<T, K extends keyof T, V> = Omit<T, K> & { [key in K]: V };

type ModifiedLiteral<T extends AST.Literal> = Rename<T, "value", "text">;
type ModifiedParent<T extends AST.Parent> = ReplaceType<
  T,
  "children",
  Modified<T["children"][0]>[]
>;
type ModifiedVoid<T> = T & {
  isVoid: true;
  children: [{ text: "" }];
};
type Modified<T> = T extends AST.Literal
  ? ModifiedLiteral<T>
  : T extends AST.Parent
  ? ModifiedParent<T>
  : ModifiedVoid<T>;

type PhrasingContent = Extract<AST.Content, AST.PhrasingContent>;
type BlockOrDefinitionContent = Extract<
  AST.Content,
  AST.BlockContent | AST.DefinitionContent
>;
type ListContent = Extract<AST.Content, AST.ListContent>;
type TableContent = Extract<AST.Content, AST.TableContent>;
type RowContent = Extract<AST.Content, AST.RowContent>;
type StaticPhrasingContent = Extract<AST.Content, AST.StaticPhrasingContent>;

export const parse = (source: string) => fromRoot(fromMarkdown(source), source);

const fromRoot = (root: AST.Root, source: string) => ({
  type: "root",
  children: root.children.map((child) => fromContent(child, source)),
});

function fromContent(
  content: StaticPhrasingContent,
  source: string
): Modified<StaticPhrasingContent>;
function fromContent(
  content: PhrasingContent,
  source: string
): Modified<PhrasingContent>;
function fromContent(
  content: BlockOrDefinitionContent,
  source: string
): Modified<BlockOrDefinitionContent>;
function fromContent(
  content: ListContent,
  source: string
): Modified<ListContent>;
function fromContent(
  content: TableContent,
  source: string
): Modified<TableContent>;
function fromContent(content: RowContent, source: string): Modified<RowContent>;
function fromContent(
  content: AST.Content,
  source: string
): Modified<AST.Content>;
function fromContent(
  content: AST.Content,
  source: string
): Modified<AST.Content> {
  switch (content.type) {
    case "html":
    case "code":
    case "yaml":
    case "text":
    case "inlineCode": {
      const { value: text, ...rest } = content;
      const literal = { ...rest, text };
      return literal;
    }

    case "paragraph":
    case "heading":
    case "tableCell":
    case "emphasis":
    case "strong":
    case "delete":
    case "footnote":
      return {
        ...content,
        children: content.children.map((child) => fromContent(child, source)),
      };

    case "blockquote":
    case "listItem":
    case "footnoteDefinition":
      return {
        ...content,
        children: content.children.map((child) => fromContent(child, source)),
      };

    case "list":
      return {
        ...content,
        children: content.children.map((child) => fromContent(child, source)),
      };

    case "table":
      return {
        ...content,
        children: content.children.map((child) => fromContent(child, source)),
      };

    case "tableRow":
      return {
        ...content,
        children: content.children.map((child) => fromContent(child, source)),
      };

    case "link":
    case "linkReference":
      return {
        ...content,
        children: content.children.map((child) => fromContent(child, source)),
      };

    case "definition":
    case "break":
    case "image":
    case "thematicBreak":
    case "imageReference":
    case "footnoteReference":
      return { ...content, isVoid: true, children: [{ text: "" }] };
  }
}

export const serialize = (ast: Modified<AST.Root>): string =>
  toMarkdown(intoRoot(ast));

const intoRoot = (ast: Modified<AST.Root>): AST.Root => ({
  type: "root",
  children: ast.children.map(intoContent),
});

function intoContent(
  content: Modified<StaticPhrasingContent>
): StaticPhrasingContent;
function intoContent(content: Modified<PhrasingContent>): PhrasingContent;
function intoContent(
  content: Modified<BlockOrDefinitionContent>
): BlockOrDefinitionContent;
function intoContent(content: Modified<ListContent>): ListContent;
function intoContent(content: Modified<TableContent>): TableContent;
function intoContent(content: Modified<RowContent>): RowContent;
function intoContent(content: Modified<AST.Content>): AST.Content;
function intoContent(content: Modified<AST.Content>): AST.Content {
  switch (content.type) {
    case "html":
    case "code":
    case "yaml":
    case "text":
    case "inlineCode": {
      const { text: value, ...rest } = content;
      const literal = { ...rest, value };
      return literal;
    }

    case "paragraph":
    case "heading":
    case "tableCell":
    case "emphasis":
    case "strong":
    case "delete":
    case "footnote":
      return {
        ...content,
        children: content.children.map((child) => intoContent(child)),
      };

    case "blockquote":
    case "listItem":
    case "footnoteDefinition":
      return {
        ...content,
        children: content.children.map((child) => intoContent(child)),
      };

    case "list":
      return {
        ...content,
        children: content.children.map((child) => intoContent(child)),
      };

    case "table":
      return {
        ...content,
        children: content.children.map((child) => intoContent(child)),
      };

    case "tableRow":
      return {
        ...content,
        children: content.children.map((child) => intoContent(child)),
      };

    case "link":
    case "linkReference":
      return {
        ...content,
        children: content.children.map((child) => intoContent(child)),
      };

    case "definition":
    case "break":
    case "image":
    case "thematicBreak":
    case "imageReference":
    case "footnoteReference": {
      const { isVoid, children, ...rest } = content;
      return rest;
    }
  }
}
