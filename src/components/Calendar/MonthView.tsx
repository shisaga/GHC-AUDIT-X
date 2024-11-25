/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useState } from "react";

import { calenderModalTitle, weekdayNames } from "./Calendar";
import DayEventListModal from "./DayEventListModal";
import CalendarDayBox from "./CalendarDayBox";
import { Each } from "@/stories/Each/Each";
import { Label } from "@/stories/Label/Label";

interface MonthViewProps {
  selectedDate: Date;
  clickedDate?: Date;
  setClickedDate: (date: Date) => void;
  events: any[];
  handleEventClick: (event: any) => void;
  setOpenCreateModuleModal: (value: boolean) => void;
  readOnlyCalendar?: boolean;
}

const MonthView: React.FC<MonthViewProps> = ({
  selectedDate,
  clickedDate,
  setClickedDate,
  events,
  handleEventClick,
  setOpenCreateModuleModal,
  readOnlyCalendar,
}) => {
  const [eventList, setEventList] = useState<any[]>([]);
  const [openEventListModal, setOpenEventListModal] = useState<boolean>(false);

  const daysInMonth = (year: number, month: number): number =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year: number, month: number): number =>
    new Date(year, month, 1).getDay();

  const handleMoreEvent = (
    events: any[],
    clickEvent: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    date: string
  ) => {
    clickEvent.stopPropagation();
    setOpenEventListModal(true);
    setEventList(events);
    setClickedDate(new Date(date));
  };

  const handleDayClick = (
    date: string,
    clickEvent: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    clickEvent.stopPropagation();
    if (!readOnlyCalendar) {
      setOpenCreateModuleModal(true);
      setClickedDate(new Date(date));
    }
  };

  const generateCalendar = (): Array<
    Array<{
      date: Date;
      isCurrentMonth: boolean;
      events: any[];
    }>
  > => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const weeks: Array<
      Array<{
        date: Date;
        isCurrentMonth: boolean;
        events: any[];
      }>
    > = [];

    // Determine the maximum number of weeks to display (5 or 6)
    const maxWeeks = Math.ceil((totalDays + firstDay) / 7);

    for (let i = 0; i < maxWeeks; i++) {
      const days: Array<{
        date: Date;
        isCurrentMonth: boolean;
        events: any[];
      }> = [];
      for (let j = 0; j < 7; j++) {
        const dayOffset = i * 7 + j + 1 - firstDay;
        const currentDate = new Date(year, month, dayOffset);
        const isCurrentMonth = dayOffset > 0 && dayOffset <= totalDays;
        const dayEvents = events.filter((event) => {
          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);
          return (
            isSameDay(new Date(event.start), currentDate) ||
            (eventStart < currentDate && eventEnd > currentDate)
          );
        });
        days.push({ date: currentDate, isCurrentMonth, events: dayEvents });
      }
      weeks.push(days);
    }

    return weeks;
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  return (
    <>
      <div className="max-w-screen h-full py-2 flex flex-col bg-white sm:px-4 px-2">
        {/* Calender day name list */}
        <div className="grid grid-cols-7 text-center ">
          <Each
            of={weekdayNames}
            render={(day) => (
              <Label
                label={day}
                className="font-semibold text-[#71717A] py-2"
              />
            )}
          />
        </div>
        {/* Calender day list */}
        <div className="w-full overflow-auto grow" id="day-boxes">
          <CalendarDayBox
            weeks={generateCalendar()}
            selectedDate={selectedDate}
            maxEventsToShow={3}
            handleMoreEvent={handleMoreEvent}
            handleEventClick={handleEventClick}
            handleDayClick={handleDayClick}
          />
        </div>
      </div>
      <DayEventListModal
        open={openEventListModal}
        close={() => setOpenEventListModal(false)}
        title={calenderModalTitle(clickedDate)}
        eventList={eventList}
        handleEventClick={handleEventClick}
      />
    </>
  );
};

export default MonthView;
