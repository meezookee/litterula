import { useCallback, useState } from "react";
import { BaseEditor, createEditor, Descendant, Editor } from "slate";
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import { Content as CustomElement, Text as CustomText } from "../markdown";

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
    isInline(element);
  editor.isVoid = (element) =>
    element.type === "thematicBreak" || isVoid(element);
  return editor;
}

const MarkdownEditor = ({
  initialValue,
  onChange,
}: {
  initialValue: Descendant[];
  onChange(value: Descendant[]): void;
}) => {
  const [editor] = useState(() => withReact(withMarkdown(createEditor())));
  const renderElement = (props: RenderElementProps) => <Element {...props} />;
  const renderLeaf = (props: RenderLeafProps) => <Leaf {...props} />;

  const handleChange = useCallback(
    (value: Descendant[]): void => {
      if (
        editor.operations.some(
          (operation) => operation.type !== "set_selection"
        )
      ) {
        onChange(value);
      }
    },
    [editor.operations, onChange]
  );

  return (
    <Slate editor={editor} value={initialValue} onChange={handleChange}>
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
            start={props.element.start ?? undefined}
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

    case "table":
    case "html":
    case "code":
    case "yaml":
    case "definition":
    case "footnoteDefinition":
      throw new Error('Not implemented yet: "footnoteReference" case');

    case "listItem":
      return <li {...props.attributes}>{props.children}</li>;

    case "tableRow":
    case "tableCell":
    case "link":
    case "linkReference":
    case "text":
      throw new Error('Not implemented yet: "footnoteReference" case');

    case "emphasis":
      return <em {...props.attributes}>{props.children}</em>;

    case "strong":
      return <strong {...props.attributes}>{props.children}</strong>;

    case "delete":
      return <del {...props.attributes}>{props.children}</del>;

    case "break":
    case "image":
    case "footnote":
    case "inlineCode":
      throw new Error('Not implemented yet: "footnoteReference" case');

    case "thematicBreak":
      return (
        <div {...props.attributes}>
          {props.children}
          <hr />
        </div>
      );

    case "imageReference":
    case "footnoteReference":
      throw new Error('Not implemented yet: "footnoteReference" case');
  }
};

const Leaf = (props: RenderLeafProps) => {
  return <span {...props.attributes}>{props.children}</span>;
};

export default MarkdownEditor;
