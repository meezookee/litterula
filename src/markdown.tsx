import type * as AST from "mdast";
import type { Position } from "unist";
import { fromMarkdown } from "mdast-util-from-markdown";

export type Element =
  | Paragraph
  | Heading
  | Blockquote
  | List
  | ListItem
  | Emphasis
  | Strong
  | Delete
  | ThematicBreak
  | Unknown;

export type Node = Element | Text;

type PhrasingContent = Text | Emphasis | Strong | Delete | Unknown;

type BlockOrDefinitionContent =
  | Paragraph
  | Heading
  | Blockquote
  | List
  | ThematicBreak
  | Unknown;

export interface Text {
  text: string;
}

export interface Paragraph {
  type: "paragraph";
  children: PhrasingContent[];
}

export interface Heading {
  type: "heading";
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  children: PhrasingContent[];
}

export interface Blockquote {
  type: "blockquote";
  children: BlockOrDefinitionContent[];
}

export type List = {
  type: "list";
  spread: boolean;
  children: ListItem[];
} & (
  | { ordered: true; start: number }
  | {
      ordered: false;
    }
);

export interface ListItem {
  type: "listItem";
  checked?: boolean | null | undefined;
  spread?: boolean | null | undefined;
  children: BlockOrDefinitionContent[];
}

export interface Emphasis {
  type: "emphasis";
  children: PhrasingContent[];
}

export interface Strong {
  type: "strong";
  children: PhrasingContent[];
}

export interface Delete {
  type: "delete";
  children: PhrasingContent[];
}

export interface ThematicBreak {
  type: "thematicBreak";
  children: [{ text: "" }];
}

export interface Unknown {
  type: "unknown";
  originalType: string;
  text: string;
}

export function parse(source: string): Node[] {
  return convertRoot(fromMarkdown(source), source);
}

function convertRoot(root: AST.Root, source: string): Node[] {
  return root.children.map((child) => convertContent(child, source));
}

function convertContent(content: AST.Content, source: string): Node {
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
      return convertThematicBreak(content);

    default:
      return unknownContent(content.type, source, content.position);
  }
}

function convertParagraph(paragraph: AST.Paragraph, source: string): Paragraph {
  return {
    type: "paragraph",
    children: paragraph.children.map((child) =>
      convertPhrasingContent(child, source)
    ),
  };
}

function convertHeading(heading: AST.Heading, source: string): Heading {
  return {
    type: "heading",
    depth: heading.depth,
    children: heading.children.map((child) =>
      convertPhrasingContent(child, source)
    ),
  };
}

function convertBlockquote(
  blockquote: AST.Blockquote,
  source: string
): Blockquote {
  return {
    type: "blockquote",
    children: blockquote.children.map((child) =>
      convertBlockOrDefinitionContent(child, source)
    ),
  };
}

function convertList(content: AST.List, source: string): List {
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
}

function convertPhrasingContent(
  content: AST.PhrasingContent,
  source: string
): PhrasingContent {
  switch (content.type) {
    case "text":
      return convertText(content);

    case "emphasis":
      return convertEmphasis(content, source);

    case "strong":
      return convertStrong(content, source);

    case "delete":
      return convertDelete(content, source);

    default:
      return unknownContent(content.type, source, content.position);
  }
}

function convertBlockOrDefinitionContent(
  content: AST.BlockContent | AST.DefinitionContent,
  source: string
): BlockOrDefinitionContent {
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
      return convertThematicBreak(content);

    default:
      return unknownContent(content.type, source, content.position);
  }
}

function convertText(content: AST.Text): Text {
  return { text: content.value };
}

function convertEmphasis(content: AST.Emphasis, source: string): Emphasis {
  return {
    type: "emphasis",
    children: content.children.map((child) =>
      convertPhrasingContent(child, source)
    ),
  };
}

function convertStrong(content: AST.Strong, source: string): Strong {
  return {
    type: "strong",
    children: content.children.map((child) =>
      convertPhrasingContent(child, source)
    ),
  };
}

function convertDelete(content: AST.Delete, source: string): Delete {
  return {
    type: "delete",
    children: content.children.map((child) =>
      convertPhrasingContent(child, source)
    ),
  };
}

function convertThematicBreak(content: AST.ThematicBreak): ThematicBreak {
  return { type: "thematicBreak", children: [{ text: "" }] };
}

function unknownContent(
  originalType: string,
  source: string,
  position?: Position
): Unknown {
  return {
    type: "unknown",
    originalType,
    text: source.slice(position?.start.offset, position?.end.offset),
  };
}
