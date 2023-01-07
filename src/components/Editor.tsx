import { fromMarkdown } from "mdast-util-from-markdown";
import { useState } from "react";
import type * as AST from "mdast";
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

type CustomElement = ParagraphElement | UnknownElement;

interface CustomText {
  text: string;
}

type PhrasingContent = CustomText | UnknownElement;

interface ParagraphElement {
  type: "paragraph";
  children: PhrasingContent[];
}

interface UnknownElement {
  type: "unknown";
  text: string;
}

function convertRoot(root: AST.Root, source: string): Descendant[] {
  return root.children.map((child) => convertContent(child, source));
}

function convertContent(content: AST.Content, source: string): Descendant {
  switch (content.type) {
    case "paragraph":
      return convertParagraph(content, source);
    default:
      return {
        type: "unknown",
        text: source.slice(
          content.position?.start.offset,
          content.position?.end.offset
        ),
      };
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

function convertPhrasingContent(
  content: AST.PhrasingContent,
  source: string
): PhrasingContent {
  switch (content.type) {
    case "text":
      return convertText(content);
    default:
      return {
        type: "unknown",
        text: source.slice(
          content.position?.start.offset,
          content.position?.end.offset
        ),
      };
  }
}

function convertText(content: AST.Text): CustomText {
  return { text: content.value };
}

const Editor = ({ initialValue }: { initialValue: string }) => {
  const [editor] = useState(() => withReact(createEditor()));
  const ast = fromMarkdown(initialValue);
  const document = convertRoot(ast, initialValue);
  const renderElement = (props: RenderElementProps) => <Element {...props} />;
  const renderLeaf = (props: RenderLeafProps) => <Leaf {...props} />;

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
    case "unknown":
      return <code {...props.attributes}>{props.children}</code>;
  }
};

const Leaf = (props: RenderLeafProps) => {
  if ("type" in props.leaf && props.leaf.type === "unknown") {
    return (
      <code className="unknown" {...props.attributes}>
        {props.children}
      </code>
    );
  }
  return <span {...props.attributes}>{props.children}</span>;
};

export default Editor;
