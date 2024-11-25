// Tabs.tsx

import React, { ReactNode } from "react";
import { Tab, Tabs, TabsBody, TabsHeader } from "@material-tailwind/react";
import "./Tabs.scss";

export interface SBTabListProps {
  label: string;
  value: string;
  hide?: boolean;
}

export interface SBTabsProps {
  activeTab: string;
  className?: string;
  tabCallback: (value: string) => void;
  tabList: SBTabListProps[];
  tabBody: ReactNode;
  tabHeaderClassName?: string;
  tabBodyClassName?: string;
  tabClassName?: string;
  tabsContainerClass?: string;
}

export const SBTabs = ({
  activeTab,
  className,
  tabCallback,
  tabList,
  tabBody,
  tabHeaderClassName,
  tabClassName,
  tabsContainerClass,
}: SBTabsProps) => {
  const handleTabClick = (index: string) => {
    tabCallback(index);
  };

  return (
    <Tabs value={activeTab} className={["storybook-tabs", className].join(" ")}>
      <div
        className={[
          "overflow-auto rounded-normal max-w-full w-fit",
          tabsContainerClass,
        ].join(" ")}
      >
        <TabsHeader
          className={[
            "storybook-tabs-header w-fit rounded-normal p-0",
            tabHeaderClassName,
          ].join(" ")}
          indicatorProps={{
            className:
              "shadow-none rounded-none rounded-normal bg-themePrimary",
          }}
        >
          {tabList
            .filter((item) => !item.hide)
            .map(({ label, value }) => (
              <Tab
                key={value}
                value={value}
                className={[
                  "storybook-tab rounded-none !z-0 md:px-10 px-6 font-bold bg-white py-2 whitespace-nowrap",
                  tabClassName,
                  activeTab === value
                    ? "!text-colorWhite"
                    : "text-themePrimary",
                ].join(" ")}
                onClick={() => handleTabClick(value)}
              >
                {label}
              </Tab>
            ))}
        </TabsHeader>
      </div>
      {tabBody}
    </Tabs>
  );
};

export interface SBTabProps {
  tabBodyClassName?: string;
  tabContent: JSX.Element | ReactNode | string;
}

export const SBTabBody = ({ tabContent, tabBodyClassName }: SBTabProps) => {
  return (
    <TabsBody
      className={["storybook-tab-body", tabBodyClassName].join(" ")}
      animate={{
        initial: { y: 250 },
        mount: { y: 0 },
        unmount: { y: 250 },
      }}
    >
      {tabContent}
    </TabsBody>
  );
};
