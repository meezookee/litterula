import Button from "./Button";
import Buttons from "./Buttons";
import { ComponentMeta } from "@storybook/react";

const meta: ComponentMeta<typeof Buttons> = {
  title: "Buttons",
  component: Buttons,
};
export default meta;

export const Default = () => (
  <div style={{ display: "inline-block" }}>
    <Buttons>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
    </Buttons>
  </div>
);
