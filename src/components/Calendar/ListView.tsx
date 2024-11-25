/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { CalendarEventTypes } from "./Calendar";

import moment from "moment";
import CalendarEventList from "./CalendarEventList";
import { useMediaQuery } from "react-responsive";
import { Label } from "@/stories/Label/Label";
import { Each } from "@/stories/Each/Each";

interface ListViewProps {
  startDate: Date;
  endDate: Date;
  events: CalendarEventTypes[];
  handleEventClick: (event: CalendarEventTypes) => void;
  filteredColor: any;
  setFilteredColor: Dispatch<SetStateAction<any>>;
}

type GroupedEvents = Record<string, CalendarEventTypes[]>;

const ListView: React.FC<ListViewProps> = ({
  startDate,
  endDate,
  events,
  handleEventClick,
  filteredColor,
  setFilteredColor,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const groupEventsByDays = (events: CalendarEventTypes[]): GroupedEvents => {
    const groupedEvents: GroupedEvents = {};

    events.forEach((event) => {
      const eventStart = moment(event.start).startOf("day");
      const eventEnd = moment(event.end).startOf("day");

      while (eventStart.isSameOrBefore(eventEnd, "day")) {
        const currentDate = eventStart.format("YYYY-MM-DD");

        if (!groupedEvents[currentDate]) {
          groupedEvents[currentDate] = [];
        }

        groupedEvents[currentDate].push(event);

        eventStart.add(1, "day"); // Move to the next day
      }
    });
    return groupedEvents;
  };

  const groupedEvents = groupEventsByDays(
    events.filter((event) => {
      const eventStart = new Date(event.start);
      return eventStart >= startDate && eventStart <= endDate;
    })
  );

  useEffect(() => {
    if (moment(startDate).startOf("month").isSame(moment().startOf("month"))) {
      const data = Object.keys(groupedEvents);
      let targetDiv = moment().format("yyyy-MM-DD");
      const todayIndex = data.findIndex((data) => data === targetDiv);
      if (todayIndex < 0) {
        const nextDateIndex = data.findIndex((date) => date > targetDiv);
        if (nextDateIndex > -1) {
          targetDiv = data[nextDateIndex];
        } else {
          targetDiv = data[data.length - 1];
        }
      }
      const myElement = document.getElementById(targetDiv);
      if (myElement) {
        myElement.scrollIntoView({
          behavior: "smooth", // You can also use 'auto' or 'instant'
          block: "start", // You can also use 'center' or 'end'
        });
      }
    }
  }, [groupedEvents]);

  return (
    <div className="flex flex-col overflow-y-auto h-full">
      <Each
        of={Object.keys(groupedEvents)}
        render={(day) => (
          <div className="border p-3 flex gap-3" id={day}>
            <div className="flex-none flex md:flex-row flex-col gap-1 md:h-7 h-fit md:min-h-[28px] md:max-h-[28px] md:items-end items-center w-10 md:w-28 sticky top-0">
              <Label
                label={moment(day).format("DD")}
                className={`flex items-center justify-center rounded-full cursor-pointer w-7 min-w-[28px] max-w-[28px] font-semibold ${
                  moment(day).startOf("day").isSame(moment().startOf("day"))
                    ? "bg-black text-white md:h-full h-7 min-h-[28px] max-h-[28px]"
                    : "text-[#3c4043]"
                }`}
              />
              <Label
                label={moment(day).format(isMobile ? "ddd" : "MMM, ddd")}
                className="!text-sm uppercase text-[#70757a]"
              />
            </div>
            <div className="flex flex-col gap-2 grow overflow-hidden w-full">
              <CalendarEventList
                events={groupedEvents[day]}
                handleEventClick={handleEventClick}
              />
            </div>
          </div>
        )}
      />
      {Object.keys(groupedEvents).length === 0 && (
        <div className="h-full flex flex-col gap-2 items-center justify-center px-2">
          <svg
            width="60"
            height="61"
            viewBox="0 0 60 61"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="30" cy="30.6655" r="30" fill="#F2F5F5" />
            <path
              d="M18 34.6655L30 41.6655L42 34.6655"
              stroke="#406ae8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18 28.6655L30 35.6655L42 28.6655"
              stroke="#406ae8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18 22.6655L30 29.6655L42 22.6655L30 15.6655L18 22.6655Z"
              stroke="#406ae8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Label
            label={
              filteredColor.text
                ? "No events found based on the applied filters. Try adjusting your search criteria."
                : "No events scheduled for this period."
            }
            className="font-semibold text-colorLight text-center"
          />
          {filteredColor.text && (
            <Label
              label="Clear Filter"
              className="text-colorLight text-center underline cursor-pointer"
              onClick={() => setFilteredColor({ color: "", text: "" })}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ListView;
