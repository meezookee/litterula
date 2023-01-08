import { useState } from "react";
import { BaseEditor, createEditor, Descendant, Editor } from "slate";
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import { Element as CustomElement, Text as CustomText } from "../markdown";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

function withMarkdown(editor: Editor): Editor {
  const { isInline, isVoid } = editor;
  editor.isInline = (element) =>
    element.type === "emphasis" ||
    element.type === "strong" ||
    element.type === "delete" ||
    element.type === "unknown" ||
    isInline(element);
  editor.isVoid = (element) =>
    element.type === "thematicBreak" || isVoid(element);
  return editor;
}

const MarkdownEditor = ({ initialValue }: { initialValue: Descendant[] }) => {
  const [editor] = useState(() => withReact(withMarkdown(createEditor())));
  const renderElement = (props: RenderElementProps) => <Element {...props} />;
  const renderLeaf = (props: RenderLeafProps) => <Leaf {...props} />;

  return (
    <Slate editor={editor} value={initialValue}>
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

export default MarkdownEditor;
