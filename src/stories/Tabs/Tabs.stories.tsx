// Tabs.stories.tsx

import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { SBTabs, SBTabBody } from "./Tabs"; // Adjust the import path based on your project structure

// Import the necessary types if needed
// import type { TabsProps, TabProps } from './Tabs';

// Define the metadata for the Tabs component
const meta: Meta<typeof SBTabs> = {
  title: "Example/SBTabs",
  component: SBTabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

// Define the template for the SBTabs component story
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

const data = [
  {
    label: "Month",
    value: "MONTH",
  },
  {
    label: "Week",
    value: "WEEK",
  },
  {
    label: "Day",
    value: "DAY",
  },
];

const handleActiveTabContent = (activeTab: string) => {
  if (activeTab === "MONTH") {
    return (
      <SBTabBody
        tabBodyClassName="custom-tab-body"
        tabContent={
          <div>
            <p>Content for the Month view</p>
          </div>
        }
      />
    );
  } else if (activeTab === "WEEK") {
    return (
      <SBTabBody
        tabBodyClassName="custom-tab-body"
        tabContent={
          <div>
            <p>Content for the Week view</p>
          </div>
        }
      />
    );
  }
  return (
    <SBTabBody
      tabBodyClassName="custom-tab-body"
      tabContent={
        <div>
          <p>Content for the default tab body</p>
        </div>
      }
    />
  );
};

export const TabsExample: Story = {
  args: {
    activeTab: "MONTH",
    className: "custom-tabs",
    tabCallback: (value) => console.log(`Selected tab: ${value}`),
    tabList: [...data],
    tabHeaderClassName: "custom-tab-header",
    tabClassName: "custom-tab",
  },

  render: (args) => (
    <SBTabs {...args} tabBody={handleActiveTabContent(args.activeTab)} />
  ),
};
