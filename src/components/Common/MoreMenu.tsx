import React, { ReactNode, useEffect, useState } from "react";
import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { placement } from "@material-tailwind/react/types/components/menu";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export interface MoreMenuProps {
  items: MenuItemProps[];
  arrowIcon?: boolean;
  placement?: placement;
  actionElement: ReactNode;
  actionElementClass?: string;
  disabled?: boolean;
  hide?: boolean;
  menuListClass?: string;
}

export interface MenuItemProps {
  iconBackground?: string;
  icon?: ReactNode;
  label: ReactNode;
  disabled?: boolean;
  hide?: boolean;
  clickAction?: VoidFunction;
  items?: MenuItemProps[];
  menuItemClassName?: string;
}

const MoreMenu: React.FC<MoreMenuProps> = ({
  items,
  placement,
  actionElement,
  actionElementClass,
  disabled,
  arrowIcon,
  hide,
  menuListClass,
}) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const handleItemClick = (clickAction: VoidFunction | undefined) => {
    setOpenMenu(false);
    if (clickAction) {
      clickAction();
    }
  };
  useEffect(() => {
    if (openMenu) {
      window.scrollTo(0, 0);
    }
  }, [openMenu]);

  return (
    <Menu
      lockScroll
      open={openMenu}
      handler={setOpenMenu}
      placement={placement}
    >
      <MenuHandler>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpenMenu(true)}
          className={`w-10 h-10 gap-2 flex items-center justify-center bg-transparent ${actionElementClass}`}
        >
          {actionElement}
          {arrowIcon && (
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`h-3.5 w-3.5 transition-transform ${
                openMenu ? "rotate-180" : ""
              }`}
            />
          )}
        </button>
      </MenuHandler>
      <MenuList
        className={`rounded-normal !z-[99999] min-w-[180px] py-1 menu-shadow ${
          menuListClass ?? ""
        }`}
        dismissible
      >
        {items.map(
          (menuItems: MenuItemProps, index: number) =>
            !menuItems.hide && (
              <>
                <div
                  className="border-b border-colorLighter last:border-b-0"
                  key={index}
                >
                  <MenuItem
                    key={index}
                    className={`${
                      menuItems?.disabled
                        ? "!cursor-not-allowed pointer-events-auto"
                        : "hover:!bg-colorLighter"
                    } flex items-center gap-2 w-full outline-none pt-2 my-1 font-medium tex-xl focus:bg-inherit text-left !text-colorBlack ${
                      menuItems?.menuItemClassName ?? ""
                    }`}
                    disabled={menuItems.disabled}
                    onClick={() =>
                      !menuItems?.disabled &&
                      handleItemClick(menuItems?.clickAction)
                    }
                  >
                    {menuItems?.icon && menuItems?.icon}
                    <div className="break-words break-all">
                      {menuItems.label}
                    </div>
                  </MenuItem>
                </div>
              </>
            )
        )}
      </MenuList>
    </Menu>
  );
};

export default MoreMenu;
