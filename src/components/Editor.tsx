import { fromMarkdown } from "mdast-util-from-markdown";
import { useState } from "react";
import type * as AST from "mdast";
import type { Position } from "unist";
import { BaseEditor, createEditor, Descendant } from "slate";
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

type CustomElement =
  | ParagraphElement
  | HeadingElement
  | BlockquoteElement
  | ListElement
  | ListItemElement
  | EmphasisElement
  | StrongElement
  | DeleteElement
  | ThematicBreakElement
  | UnknownElement;

interface CustomText {
  text: string;
}

type PhrasingContent =
  | CustomText
  | EmphasisElement
  | StrongElement
  | DeleteElement
  | UnknownElement;

type BlockOrDefinitionContent =
  | ParagraphElement
  | HeadingElement
  | BlockquoteElement
  | ListElement
  | ThematicBreakElement
  | UnknownElement;

interface ParagraphElement {
  type: "paragraph";
  children: PhrasingContent[];
}

interface HeadingElement {
  type: "heading";
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  children: PhrasingContent[];
}

interface BlockquoteElement {
  type: "blockquote";
  children: BlockOrDefinitionContent[];
}

type ListElement = {
  type: "list";
  spread: boolean;
  children: ListItemElement[];
} & (
  | { ordered: true; start: number }
  | {
      ordered: false;
    }
);

interface ListItemElement {
  type: "listItem";
  checked?: boolean | null | undefined;
  spread?: boolean | null | undefined;
  children: BlockOrDefinitionContent[];
}

interface EmphasisElement {
  type: "emphasis";
  children: PhrasingContent[];
}

interface StrongElement {
  type: "strong";
  children: PhrasingContent[];
}

interface DeleteElement {
  type: "delete";
  children: PhrasingContent[];
}

interface ThematicBreakElement {
  type: "thematicBreak";
  children: [{ text: "" }];
}

interface UnknownElement {
  type: "unknown";
  originalType: string;
  text: string;
}

function convertRoot(root: AST.Root, source: string): Descendant[] {
  return root.children.map((child) => convertContent(child, source));
}

function convertContent(content: AST.Content, source: string): Descendant {
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

function convertParagraph(
  paragraph: AST.Paragraph,
  source: string
): ParagraphElement {
  return {
    type: "paragraph",
    children: paragraph.children.map((child) =>
      convertPhrasingContent(child, source)
    ),
  };
}

function convertHeading(heading: AST.Heading, source: string): HeadingElement {
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
): BlockquoteElement {
  return {
    type: "blockquote",
    children: blockquote.children.map((child) =>
      convertBlockOrDefinitionContent(child, source)
    ),
  };
}

function convertList(content: AST.List, source: string): ListElement {
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

function convertText(content: AST.Text): CustomText {
  return { text: content.value };
}

function convertEmphasis(
  content: AST.Emphasis,
  source: string
): EmphasisElement {
  return {
    type: "emphasis",
    children: content.children.map((child) =>
      convertPhrasingContent(child, source)
    ),
  };
}

function convertStrong(content: AST.Strong, source: string): StrongElement {
  return {
    type: "strong",
    children: content.children.map((child) =>
      convertPhrasingContent(child, source)
    ),
  };
}

function convertDelete(content: AST.Delete, source: string): DeleteElement {
  return {
    type: "delete",
    children: content.children.map((child) =>
      convertPhrasingContent(child, source)
    ),
  };
}

function convertThematicBreak(
  content: AST.ThematicBreak
): ThematicBreakElement {
  return { type: "thematicBreak", children: [{ text: "" }] };
}

function unknownContent(
  originalType: string,
  source: string,
  position?: Position
): UnknownElement {
  return {
    type: "unknown",
    originalType,
    text: source.slice(position?.start.offset, position?.end.offset),
  };
}

const Editor = ({ initialValue }: { initialValue: string }) => {
  const [editor] = useState(() => withReact(createEditor()));
  const ast = fromMarkdown(initialValue);
  const document = convertRoot(ast, initialValue);
  const renderElement = (props: RenderElementProps) => <Element {...props} />;
  const renderLeaf = (props: RenderLeafProps) => <Leaf {...props} />;

  const { isInline, isVoid } = editor;
  editor.isInline = (element) =>
    element.type === "emphasis" ||
    element.type === "strong" ||
    element.type === "delete" ||
    element.type === "unknown" ||
    isInline(element);
  editor.isVoid = (element) =>
    element.type === "thematicBreak" || isVoid(element);

  return (
    <Slate editor={editor} value={document}>
      <Editable renderElement={renderElement} renderLeaf={renderLeaf} />
    </Slate>
  );
};

const Element = (props: RenderElementProps) => {
  switch (props.element.type) {
    case "paragraph":
      return <p {...props.attributes}>{props.children}</p>;

    case "heading": {
      const H = `h${props.element.depth}`;
      return <H {...props.attributes}>{props.children}</H>;
    }

    case "blockquote":
      return <blockquote {...props.attributes}>{props.children}</blockquote>;

    case "list":
      if (props.element.ordered) {
        return (
          <ol
            className={props.element.spread ? "spread" : ""}
            start={props.element.start}
            {...props.attributes}
          >
            {props.children}
          </ol>
        );
      } else {
        return (
          <ul
            className={props.element.spread ? "spread" : ""}
            {...props.attributes}
          >
            {props.children}
          </ul>
        );
      }

    case "listItem":
      return <li {...props.attributes}>{props.children}</li>;

    case "emphasis":
      return <em {...props.attributes}>{props.children}</em>;

    case "strong":
      return <strong {...props.attributes}>{props.children}</strong>;

    case "delete":
      return <del {...props.attributes}>{props.children}</del>;

    case "thematicBreak":
      return (
        <div {...props.attributes}>
          {props.children}
          <hr />
        </div>
      );

    case "unknown":
      return (
        <code className="unknown" {...props.attributes}>
          {props.element.originalType} {props.children}
        </code>
      );
  }
};

const Leaf = (props: RenderLeafProps) => {
  if ("type" in props.text && props.text.type === "unknown") {
    return (
      <code className="unknown" {...props.attributes}>
        [{"originalType" in props.text && props.text.originalType}]
        {props.children}
      </code>
    );
  }
  return <span {...props.attributes}>{props.children}</span>;
};

export default Editor;
