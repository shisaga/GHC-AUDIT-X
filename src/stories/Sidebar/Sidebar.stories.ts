import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./Sidebar";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Sidebar> = {
  title: "Example/Sidebar",
  component: Sidebar,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

// More on writing stories with  args: https://storybook.js.org/docs/react/writing-stories/args
export const DefaultSidebar: Story = {
  args: {
    open: true,
    close: () => {},
    title: "",
  },
};
