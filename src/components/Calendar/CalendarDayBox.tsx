import React from "react";

import CalendarDayBoxEvents from "./CalendarDayBoxEvents";
import { Each } from "@/stories/Each/Each";

interface CalendarDayBoxProps {
  // eslint-disable-next-line @typescript-eslint/array-type
  weeks: {
    date: Date;
    isCurrentMonth: boolean;
    events: any[];
  }[][];
  selectedDate: Date;
  maxEventsToShow: number;
  handleEventClick: (event: any) => void;
  handleDayClick: (
    date: string,
    clickEvent: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  handleMoreEvent: (
    events: any[],
    clickEvent: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    date: string,
    week: number
  ) => void;
}

const CalendarDayBox = ({
  weeks,
  selectedDate,
  maxEventsToShow,
  handleMoreEvent,
  handleEventClick,
  handleDayClick,
}: CalendarDayBoxProps) => {
  return (
    <Each
      of={weeks}
      render={(week, weekIndex) => (
        <div className="grid grid-cols-7 w-full h-fit min-h-[125px]">
          <Each
            of={week}
            render={({ date, isCurrentMonth, events }) => (
              <CalendarDayBoxEvents
                selectedDate={selectedDate}
                maxEventsToShow={maxEventsToShow}
                handleMoreEvent={handleMoreEvent}
                handleEventClick={handleEventClick}
                handleDayClick={handleDayClick}
                date={date}
                isCurrentMonth={isCurrentMonth}
                events={events}
                weekIndex={weekIndex}
              />
            )}
          />
        </div>
      )}
    />
  );
};

export default CalendarDayBox;
