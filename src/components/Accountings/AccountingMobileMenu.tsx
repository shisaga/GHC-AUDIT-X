import React, { Dispatch, SetStateAction } from "react";
import MoreMenu, { MenuItemProps } from "../Common/MoreMenu";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { useMediaQuery } from "react-responsive";

const AccountingMobileMenu = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}) => {
  const isSmallMobile = useMediaQuery({ maxWidth: 429 });
  const menuItems: MenuItemProps[] = [
    {
      label: (
        <span
          className={activeTab === "GHC to Auditor" ? "text-themePrimary" : ""}
        >
          GHC to Auditor
        </span>
      ),
      clickAction: () => setActiveTab("GHC to Auditor"),
    },
    {
      label: (
        <span
          className={
            activeTab === "GHC to Contractor" ? "text-themePrimary" : ""
          }
        >
          GHC to Contractor
        </span>
      ),
      clickAction: () => setActiveTab("GHC to Contractor"),
    },
    {
      label: (
        <span className={activeTab === "GHC to SO" ? "text-themePrimary" : ""}>
          GHC to SO
        </span>
      ),
      clickAction: () => setActiveTab("GHC to SO"),
    },
  ];

  return (
    <MoreMenu
      actionElement={
        isSmallMobile ? (
          <PiDotsThreeOutlineVerticalFill
            color="var(--color-primary)"
            className="text-lg"
          />
        ) : (
          "Accounting"
        )
      }
      actionElementClass="min-w-fit px-[10px] px-4 !w-8 !h-8 border border-themePrimary text-themePrimary !bg-colorWhite !font-semibold !rounded-[10px]"
      items={menuItems}
      placement="bottom-end"
    />
  );
};

export default AccountingMobileMenu;
