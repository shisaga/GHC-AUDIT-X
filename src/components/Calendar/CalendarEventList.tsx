import React from "react";
import { Each } from "@/stories/Each/Each";
import EventView from "./EventView";

interface CalendarEventListProps {
  events: any[];
  handleEventClick: (event: any) => void;
}

const CalendarEventList = ({
  events,
  handleEventClick,
}: CalendarEventListProps) => {
  return (
    <Each
      of={events}
      render={(event) => {
        return (
          <div className="mx-1">
            <EventView event={event} handleEventClick={handleEventClick} />
          </div>
        );
      }}
    />
  );
};

export default CalendarEventList;
