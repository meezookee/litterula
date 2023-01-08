import type * as AST from "mdast";
import type * as Unist from "unist";
import { fromMarkdown } from "mdast-util-from-markdown";

type Rename<T, K1 extends keyof T, K2 extends string> = Omit<T, K1> & {
  [key in K2]: T[K1];
};

type ReplaceType<T, K extends keyof T, V> = Omit<T, K> & { [key in K]: V };

type Modified<T> =
  | (T extends AST.Literal
      ? Rename<T, "value", "text">
      : T extends AST.Parent
      ? ReplaceType<T, "children", Modified<T["children"][0]>[]>
      : T)
  | Unknown;

export type Text = Modified<AST.Text>;

type Converter<T> = (content: T, source: string) => Modified<T> | Unknown;

export type Element = Modified<AST.Content>;

interface Unknown {
  type: "unknown";
  originalType: string;
  text: string;
}

export const parse = (source: string) =>
  convertRoot(fromMarkdown(source), source);

const convertRoot: Converter<AST.Root> = (root, source) => ({
  type: "root",
  children: root.children.map((child) => convertContent(child, source)),
});

const convertContent: Converter<AST.Content> = (content, source) => {
  switch (content.type) {
    case "paragraph":
      return convertParagraph(content, source);

    case "heading":
      return convertHeading(content, source);

    case "blockquote":
      return convertBlockquote(content, source);

    case "list":
      return convertList(content, source);

    case "thematicBreak":
      return convertThematicBreak(content, source);

    default:
      return unknownContent(content.type, source, content.position);
  }
};

const convertParagraph: Converter<AST.Paragraph> = (paragraph, source) => ({
  type: "paragraph",
  children: paragraph.children.map((child) =>
    convertPhrasingContent(child, source)
  ),
});

const convertHeading: Converter<AST.Heading> = (heading, source) => ({
  type: "heading",
  depth: heading.depth,
  children: heading.children.map((child) =>
    convertPhrasingContent(child, source)
  ),
});

const convertBlockquote: Converter<AST.Blockquote> = (blockquote, source) => ({
  type: "blockquote",
  children: blockquote.children.map((child) =>
    convertBlockOrDefinitionContent(child, source)
  ),
});

const convertList: Converter<AST.List> = (content, source) => {
  const children = content.children.map((item) => ({
    type: "listItem" as const,
    checked: !!item.checked,
    spread: !!item.spread,
    children: item.children.map((child) =>
      convertBlockOrDefinitionContent(child, source)
    ),
  }));
  if (content.ordered) {
    return {
      type: "list",
      ordered: true,
      start: Number(content.start),
      spread: !!content.spread,
      children,
    };
  } else {
    return {
      type: "list",
      ordered: false,
      spread: !!content.spread,
      children,
    };
  }
};

const convertPhrasingContent: Converter<AST.PhrasingContent> = (
  content,
  source
) => {
  switch (content.type) {
    case "text":
      return convertText(content, source);

    case "emphasis":
      return convertEmphasis(content, source);

    case "strong":
      return convertStrong(content, source);

    case "delete":
      return convertDelete(content, source);

    default:
      return unknownContent(content.type, source, content.position);
  }
};

const convertBlockOrDefinitionContent: Converter<
  AST.BlockContent | AST.DefinitionContent
> = (content, source) => {
  switch (content.type) {
    case "paragraph":
      return convertParagraph(content, source);

    case "heading":
      return convertHeading(content, source);

    case "blockquote":
      return convertBlockquote(content, source);

    case "list":
      return convertList(content, source);

    case "thematicBreak":
      return convertThematicBreak(content, source);

    default:
      return unknownContent(content.type, source, content.position);
  }
};

const convertText: Converter<AST.Text> = (content): Text => ({
  type: "text",
  text: content.value,
});

const convertEmphasis: Converter<AST.Emphasis> = (content, source) => ({
  type: "emphasis",
  children: content.children.map((child) =>
    convertPhrasingContent(child, source)
  ),
});

const convertStrong: Converter<AST.Strong> = (content, source) => ({
  type: "strong",
  children: content.children.map((child) =>
    convertPhrasingContent(child, source)
  ),
});

const convertDelete: Converter<AST.Delete> = (content, source) => ({
  type: "delete",
  children: content.children.map((child) =>
    convertPhrasingContent(child, source)
  ),
});

const convertThematicBreak: Converter<AST.ThematicBreak> = () => ({
  type: "thematicBreak",
  children: [{ text: "" }],
});

const unknownContent = (
  originalType: string,
  source: string,
  position?: Unist.Position
): Unknown => ({
  type: "unknown",
  originalType,
  text: source.slice(position?.start.offset, position?.end.offset),
});
