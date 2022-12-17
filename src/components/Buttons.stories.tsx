import LinkButton from "./LinkButton";
import Buttons from "./Buttons";
import { ComponentMeta } from "@storybook/react";

const meta: ComponentMeta<typeof Buttons> = {
  title: "Buttons",
  component: Buttons,
};
export default meta;

export const Single = () => (
  <div style={{ display: "inline-block" }}>
    <Buttons>
      <LinkButton to="">Button</LinkButton>
    </Buttons>
  </div>
);

export const Multiple = () => (
  <div style={{ display: "inline-block" }}>
    <Buttons>
      <LinkButton to="">Button 1</LinkButton>
      <LinkButton to="">Button 2</LinkButton>
      <LinkButton to="">Button 3</LinkButton>
    </Buttons>
  </div>
);
