import { Lexer } from "marked";
import { useCallback, useEffect, useState } from "react";
import { BaseEditor, createEditor, Descendant } from "slate";
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderElementProps,
} from "slate-react";

type CustomElement = HeadingElement | ParagraphElement;
type HeadingElement = {
  type: "heading";
  level: number;
  children: CustomText[];
};
type ParagraphElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const Heading = (props: RenderElementProps & { level: number }) => {
  const E = `h${props.level}`;
  return <E {...props.attributes}>{props.children}</E>;
};

const Paragraph = (props: RenderElementProps) => (
  <p {...props.attributes}>{props.children}</p>
);

const Editor = ({ initialValue }: { initialValue: string }) => {
  const [editor] = useState(() => withReact(createEditor()));
  const [document, setDocument] = useState<Descendant[]>([]);

  useEffect(() => {
    const lexer = new Lexer();
    const tokens = lexer.lex(initialValue);
    console.log(tokens);
    setDocument(parse(tokens));
  }, [initialValue]);

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "heading":
        return <Heading level={props.element.level} {...props} />;
      case "paragraph":
        return <Paragraph {...props} />;
    }
  }, []);

  return document.length ? (
    <Slate editor={editor} value={document}>
      <Editable renderElement={renderElement} />
    </Slate>
  ) : null;
};

type Token = ReturnType<Lexer["lex"]>[0];
const parse = (tokens: Token[]): Descendant[] => {
  const result: Descendant[] = [];
  for (const token of tokens) {
    switch (token.type) {
      case "heading":
        result.push(parseHeading(token));
        break;
      case "paragraph":
        result.push(parseParagraph(token));
        break;
    }
  }
  return result;
};

const parseParagraph = (
  token: Token & { type: "paragraph" }
): ParagraphElement => ({
  type: "paragraph",
  children: token.tokens
    .map((token) => {
      if (token.type !== "text") {
        console.warn("unexpected token type", token.type, "in paragraph");
        return null;
      }
      return { text: token.text };
    })
    .filter((x): x is NonNullable<typeof x> => !!x),
});

const parseHeading = (token: Token & { type: "heading" }): HeadingElement => ({
  type: "heading",
  level: token.depth,
  children: token.tokens
    .map((token) => {
      if (token.type !== "text") {
        console.warn("unexpected token type", token.type, "in heading");
        return null;
      }
      return { text: token.text };
    })
    .filter((x): x is NonNullable<typeof x> => !!x),
});

export default Editor;
