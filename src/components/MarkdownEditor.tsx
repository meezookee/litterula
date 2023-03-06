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
import { Content, Text as CustomText } from "../markdown";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

type CustomElement = Exclude<Content, CustomText>;

function withMarkdown(editor: Editor): Editor {
  const { isInline, isVoid } = editor;
  editor.isInline = (element) =>
    element.type === "emphasis" ||
    element.type === "strong" ||
    element.type === "delete" ||
    isInline(element);
  editor.isVoid = (element) => "isVoid" in element || isVoid(element);
  return editor;
}

const MarkdownEditor = ({
  value,
  onChange,
}: {
  value: Descendant[];
  onChange(value: Descendant[]): void | Promise<void>;
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
        void onChange(value);
      }
    },
    [editor.operations, onChange]
  );

  /*
  useEffect(() => {
    editor.children = value;
    editor.onChange();
  }, [editor, value]);
  */

  return (
    <Slate editor={editor} value={value} onChange={handleChange}>
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

    case "listItem":
      return <li {...props.attributes}>{props.children}</li>;

    case "link":
      return <a {...props.attributes}>{props.children}</a>;

    case "table":
      return <table {...props.attributes}>{props.children}</table>;

    case "tableRow":
      return <tr {...props.attributes}>{props.children}</tr>;

    case "tableCell":
      return <td {...props.attributes}>{props.children}</td>;

    case "code":
      return (
        <pre {...props.attributes}>
          <code>{props.children}</code>
        </pre>
      );

    case "inlineCode":
      return <code {...props.attributes}>{props.children}</code>;

    case "html":
    case "yaml":
    case "definition":
    case "footnoteDefinition":
    case "linkReference":
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
