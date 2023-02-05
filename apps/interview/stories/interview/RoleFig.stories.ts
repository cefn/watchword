import { Meta, StoryObj } from "@storybook/react";
import { FIGURE_IDS, RoleFig } from "../../src/components/RoleFig";

const meta = {
  title: "Interview/RoleFig",
  component: RoleFig,
  tags: ["autodocs"],
  argTypes: {
    id: {
      options: FIGURE_IDS,
      control: "select",
    },
  },
} satisfies Meta<typeof RoleFig>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: {
    style: "figure",
    id: "agile_user",
    labelled: true,
    taggedTales: 1,
    totalTales: 3,
  },
};
