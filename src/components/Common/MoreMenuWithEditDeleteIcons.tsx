import React, { ReactNode } from "react";
import { placement } from "@material-tailwind/react/types/components/menu";
import { Button } from "@/stories/Button/Button";
import MoreMenu, { MenuItemProps } from "./MoreMenu";

export interface MoreActionButtonsProps {
  items: MenuItemProps[];
  placement?: placement;
  actionElement: ReactNode;
  actionElementClass?: string;
  disabled?: boolean;
  hide?: boolean;
  menuListClass?: string;
  editView?: boolean;
  editDelete?: boolean;
}

const MoreActionButtons: React.FC<MoreActionButtonsProps> = ({
  items,
  placement,
  actionElement,
  actionElementClass,
  disabled,
  hide,
  menuListClass,
  editDelete,
  editView,
}) => {
  const handleItemClick = (clickAction: VoidFunction | undefined) => {
    if (clickAction) {
      clickAction();
    }
  };

  const filterEditDeleteActions = (items: MenuItemProps[]) => {
    return items.filter(
      (item) => item.label === "Edit" || item.label === "Delete"
    );
  };

  const filterEditViewActions = (items: MenuItemProps[]) => {
    return items.filter(
      (item) => item.label === "Edit" || item.label === "View"
    );
  };

  const removeEditDeleteActions = (items: MenuItemProps[]) => {
    return items.filter(
      (item) => item.label !== "Edit" && item.label !== "Delete"
    );
  };
  const removeEditViewActions = (items: MenuItemProps[]) => {
    return items.filter(
      (item) => item.label !== "Edit" && item.label !== "View"
    );
  };

  const editDeleteItems = filterEditDeleteActions(items);

  const editViewItems = filterEditViewActions(items);

  const otherItems = editView
    ? removeEditViewActions(items)
    : removeEditDeleteActions(items);

  return (
    <div className="flex gap-2 justify-end">
      {(editView ? editViewItems : editDeleteItems).map(
        (menuItems: MenuItemProps) =>
          !menuItems.hide && (
            <Button
              label=""
              key={menuItems.label?.toString()}
              variant="more-menu-item"
              style={{ background: menuItems?.iconBackground }}
              size="large"
              icon={menuItems?.icon}
              onClick={() =>
                !menuItems?.disabled && handleItemClick(menuItems?.clickAction)
              }
            />
          )
      )}
      {otherItems.length > 0 && (
        <MoreMenu
          actionElement={actionElement}
          items={otherItems}
          placement={placement}
          actionElementClass={actionElementClass}
          disabled={disabled}
          hide={hide}
          menuListClass={menuListClass}
        />
      )}
    </div>
  );
};

export default MoreActionButtons;
