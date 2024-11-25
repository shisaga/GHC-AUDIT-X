import React, { SetStateAction, Dispatch, useState } from "react";

import {
  FaAngleLeft,
  FaAngleRight,
  FaBriefcase,
  FaFilter,
  FaPlus,
} from "react-icons/fa";

import moment from "moment";
import { useMediaQuery } from "react-responsive";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCalendarDay,
  faCalendarXmark,
  faFilterCircleXmark,
  faTableCells,
  faTableColumns,
} from "@fortawesome/free-solid-svg-icons";

import { Button } from "@/stories/Button/Button";
import { Heading } from "@/stories/Heading/Heading";
import { useAuth } from "@/contexts/AuthProvider";
import { getDateInFormat } from "@/utils/CommonFunction";
import MoreMenu from "../Common/MoreMenu";
import { SBTabs } from "@/stories/Tabs/Tabs";
import { TbBasketDiscount } from "react-icons/tb";

// import { SBTabs } from "@/stories/Tabs/Tabs";

interface CalendarActionsType {
  setSelectedDate: (date: Date) => void;
  selectedDate: Date;
  selectedView: "week" | "month" | "day" | "list";
  setSelectedView: (view: "week" | "month" | "day" | "list") => void;
  disableActions?: boolean;
  showTodayButton?: boolean;
  showNextPrevButtons?: boolean;
  showMoreActions?: boolean;
  showViewButtons?: boolean;
  setOpenUnscheduleJobSidebar: Dispatch<SetStateAction<boolean>>;
  filteredColor: any;
  setFilteredColor: Dispatch<SetStateAction<any>>;
  readOnlyCalendar?: boolean;
}

const CalendarActions: React.FC<CalendarActionsType> = ({
  setSelectedDate,
  selectedDate,
  selectedView,
  setSelectedView,
  disableActions,
  showMoreActions,
  showNextPrevButtons,
  showTodayButton,
  showViewButtons,
  setOpenUnscheduleJobSidebar,
  filteredColor,
  setFilteredColor,
  readOnlyCalendar,
}) => {
  const today = new Date();
  const showCalendarTime = true;
  const [openFilterSidebar, setOpenFilterSidebar] = useState<boolean>(false);

  const isTablet = useMediaQuery({ maxWidth: 1224 });
  const isSmallMobile = useMediaQuery({ maxWidth: 520 });

  const formatSelectedDate = (date: Date): string =>
    selectedView === "day"
      ? getDateInFormat(date.getTime(), "mm-dd-yyyy")
      : new Intl.DateTimeFormat("en-US", {
          month: "long",
          year: "numeric",
        }).format(date);
  const viewMenuItems: any = [
    {
      label: "Month",
      icon: <FontAwesomeIcon icon={faTableCells} size="lg" />,
      iconBackground: "#c2c2c2",
      menuItemClassName: "hover:bg-[#c2c2c2]",
      clickAction: () => {
        setSelectedView("month");
      },
    },
    {
      label: "Week",
      icon: <FontAwesomeIcon icon={faTableColumns} size="lg" />,
      clickAction: () => {
        setSelectedView("week");
      },
      iconBackground: "#c2c2c2",
      menuItemClassName: "hover:bg-[#c2c2c2]",
      hide: !showCalendarTime,
    },
  ];

  const renderViewIcon = () =>
    viewMenuItems.find(
      (item: any) => item.label?.toString().toLocaleLowerCase() === selectedView
    )?.icon;

  const handleDateNavigation = (actionType: "previous" | "today" | "next") => {
    const view: "day" | "week" | "month" =
      selectedView !== "list" ? selectedView : "month";

    let date;

    switch (actionType) {
      case "previous":
        date = moment(selectedDate).subtract(1, view).toDate();
        break;
      case "next":
        date = moment(selectedDate).add(1, view).toDate();
        break;
      case "today":
        date = today;
        break;
      default:
        date = selectedDate;
        break;
    }

    setSelectedDate(date);
  };

  const renderMoreMenuOfViews = () => (
    <div className="w-12 h-10 flex items-center justify-center rounded-normal !px-2 bg-white">
      {selectedView === "list" ? (
        <FontAwesomeIcon
          icon={faTableCells}
          size="lg"
          onClick={() => setSelectedView("month")}
        />
      ) : (
        <FontAwesomeIcon
          icon={faTableColumns}
          size="lg"
          onClick={() => setSelectedView("list")}
        />
      )}
    </div>

    // <MoreMenu
    //   actionElement={renderViewIcon()}
    //   disabled={disableActions}
    //   actionElementClass="storybook-button gap-2 outline-none overflow-hidden whitespace-nowrap storybook-button--medium storybook-button--white !border-none !px-4 w-auto h-auto"
    //   items={viewMenuItems}
    //   placement="bottom-start"
    // />
  );

  const renderDayActionButton = () => (
    <div className="flex gap-4 w-full">
      {showTodayButton && (
        <Button
          id="today"
          label="Today"
          // variant="white"
          className="!border-none !px-3 md:w-full"
          onClick={() => handleDateNavigation("today")}
          disabled={disableActions}
        />
      )}
      {showNextPrevButtons && (
        <>
          <Button
            id="previous-date"
            label=""
            icon={<FaAngleLeft className="text-lg" />}
            variant="white"
            className="!border-none !px-4 !rounded-r-none"
            onClick={() => handleDateNavigation("previous")}
            disabled={disableActions}
          />
          <Button
            id="next-date"
            label=""
            icon={<FaAngleRight className="text-lg" />}
            variant="white"
            className="!border-none !px-4 !rounded-l-none"
            onClick={() => handleDateNavigation("next")}
            disabled={disableActions}
          />
        </>
      )}
    </div>
  );

  const renderFilterButton = () => (
    <Button
      label=""
      icon={
        filteredColor?.text ? (
          <FontAwesomeIcon icon={faFilterCircleXmark} />
        ) : (
          <FaFilter />
        )
      }
      variant="white"
      className="!border-none !px-4"
      onClick={() => setOpenFilterSidebar(true)}
      disabled={disableActions}
    />
  );
  // const renderCreateButton = () => (
  //   <MoreMenu
  //     actionElement={
  //       <>
  //         <FaPlus />
  //         {!isSmallMobile && "Create"}
  //       </>
  //     }
  //     actionElementClass="storybook-button min-w-fit gap-2 outline-none overflow-hidden whitespace-nowrap storybook-button--medium storybook-button--primary !border-none !px-3 w-auto h-auto"
  //     disabled={disableActions}
  //     items={createMenuItems}
  //     placement="bottom-start"
  //   />
  // );

  return (
    <div className="flex flex-col gap-4 px-3">
      <div className="flex items-center justify-between gap-1">
        {!isSmallMobile && <div>{renderDayActionButton()}</div>}
        <div
          className={readOnlyCalendar ? "md:min-w-[200px]" : "md:min-w-[270px]"}
        >
          <Heading
            type={readOnlyCalendar ? "h3" : "h1"}
            label={formatSelectedDate(selectedDate)}
          />
        </div>
        <div className="flex gap-4">
          {/* {!isSmallMobile && renderFilterButton()} */}
          {!isSmallMobile &&
            !isTablet &&
            showViewButtons &&
            !readOnlyCalendar && (
              <SBTabs
                activeTab={selectedView}
                className="w-full"
                tabCallback={(value: any) => {
                  setSelectedView(value);
                }}
                tabList={[
                  { label: "Month", value: "month" },
                  // { label: "Week", value: "week" },
                  // { label: "Day", value: "day" },
                  { label: "List", value: "list" },
                ]}
                tabBody={null}
              />
            )}

          {/* {((!isSmallMobile && isTablet && showViewButtons) ||
            readOnlyCalendar) &&
            renderMoreMenuOfViews()} */}
        </div>
      </div>
      {isSmallMobile && (
        <div className="flex gap-3">
          {renderDayActionButton()}
          {renderMoreMenuOfViews()}
          {/* {renderFilterButton()} */}
        </div>
      )}
    </div>
  );
};

export default CalendarActions;
