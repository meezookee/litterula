import Button from "./Button";
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
      <Button>Button</Button>
    </Buttons>
  </div>
);

export const Multiple = () => (
  <div style={{ display: "inline-block" }}>
    <Buttons>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </Buttons>
  </div>
);
