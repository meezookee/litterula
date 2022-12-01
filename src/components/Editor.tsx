import { useCallback, useState } from "react";
import { BaseEditor, createEditor } from "slate";
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderElementProps,
} from "slate-react";

type CustomElement = ParagraphElement;
type ParagraphElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const Paragraph = (props: RenderElementProps) => (
  <p {...props.attributes}>{props.children}</p>
);

const initialValue = [
  { type: "paragraph" as const, children: [{ text: "Hello, world!" }] },
];

const Editor = () => {
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "paragraph":
        return <Paragraph {...props} />;
    }
  }, []);

  return (
    <Slate editor={editor} value={initialValue}>
      <Editable renderElement={renderElement} />
    </Slate>
  );
};

export default Editor;
