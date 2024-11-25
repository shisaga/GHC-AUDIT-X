import React from "react";
import { useDrop } from "react-dnd";

import { useMediaQuery } from "react-responsive";
import CalendarEventList from "./CalendarEventList";
import { Label } from "@/stories/Label/Label";

interface CalendarDayBoxEventsProps {
  selectedDate: Date;
  maxEventsToShow: number;
  handleEventClick: (event: any) => void;
  handleDayClick: (
    date: any,
    clickEvent: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  handleMoreEvent: (
    events: any[],
    clickEvent: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    date: any,
    week: number
  ) => void;
  date: any;
  isCurrentMonth: boolean;
  events: any[];
  weekIndex: number;
}

const CalendarDayBoxEvents = ({
  selectedDate,
  maxEventsToShow,
  handleMoreEvent,
  handleEventClick,
  handleDayClick,
  date,
  isCurrentMonth,
  events,
  weekIndex,
}: CalendarDayBoxEventsProps) => {
  const today = new Date();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const day = date.getDate();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const dropDate = new Date(date);
  const isToday =
    day === today.getDate() &&
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getFullYear() === today.getFullYear();
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "EVENT",
    drop: () => ({ name: dropDate }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;

  return (
    <button
      className="flex flex-col pb-3 pt-1 items-center w-full h-full border border-[#dadce0] cursor-pointer overflow-hidden"
      style={{ backgroundColor: isActive ? "#e8f0fe" : "" }}
      onClick={(e) => handleDayClick(date, e)}
      ref={drop}
      data-testid={dropDate}
    >
      <Label
        label={day}
        className={`h-7 w-7 min-h-[22px] max-h-[22px] min-w-[22px] max-w-[22px] flex items-center justify-center rounded-full cursor-pointer ${
          isToday && isCurrentMonth ? "bg-black text-white" : ""
        } ${!isCurrentMonth ? "text-gray-500" : ""}`}
        size="small"
      />
      {events.length > 0 && (
        <div className="w-full flex flex-col gap-1 mt-1">
          <CalendarEventList
            events={
              events.length > maxEventsToShow
                ? events.slice(0, maxEventsToShow - 1)
                : events
            }
            handleEventClick={handleEventClick}
          />
          {events.length > maxEventsToShow && (
            <button
              className="hover:bg-lightThemeColor rounded mx-1 p-1"
              onClick={(e) => {
                handleMoreEvent(events, e, date, weekIndex);
              }}
            >
              <Label
                label={["+ ", events.length - maxEventsToShow + 1, "more"].join(
                  " "
                )}
                className={[
                  "text-gray-500 truncate block !whitespace-nowrap cursor-pointer select-none",
                  isMobile ? "!text-xs" : "",
                ].join(" ")}
                size="small"
              />
            </button>
          )}
        </div>
      )}
    </button>
  );
};

export default CalendarDayBoxEvents;
