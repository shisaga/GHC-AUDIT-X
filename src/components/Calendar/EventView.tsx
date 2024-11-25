import React from "react";

import moment from "moment";

import { CalendarEventTypes } from "./Calendar";
import { useAuth } from "@/contexts/AuthProvider";
import { Label } from "@/stories/Label/Label";
import { EANumberFormatter } from "@/utils/CommonFunction";

interface EventViewProps {
  event: CalendarEventTypes;
  handleEventClick: (event: CalendarEventTypes) => void;
  titleClassName?: string;
  className?: string;
  isAllDay?: boolean;
  parentClassName?: string;
}

const EventView = ({
  event,
  handleEventClick,
  titleClassName,
  className,
  isAllDay,
  parentClassName,
}: EventViewProps) => {
  const {
    eventColor,
    start,
    end,
    title,
    eventType,
    audit,
    auditMode,
    auditorEA,
    orderStatus,
  } = event;
  const { userInfo } = useAuth();
  const showCalendarTime = true;
  return (
    <button
      className={[
        "rounded py-1 cursor-pointer h-full px-1.5 overflow-hidden w-full",
        parentClassName,
      ].join(" ")}
      style={{
        background: eventColor,
        color: "#000",
      }}
      onClick={(e) => {
        e.stopPropagation();
        handleEventClick(event);
      }}
    >
      <div
        className={[
          "flex flex-col w-full text-left",
          orderStatus && eventType === "MODULE.JOB" && orderStatus === "closed"
            ? "decoration-2 line-through"
            : "",
          className,
        ].join(" ")}
      >
        <Label
          label={
            title === "-"
              ? "#" +
                EANumberFormatter(
                  auditorEA,
                  auditMode?.split("")[0] as string,
                  audit as number
                )
              : title
          }
          className={[
            "truncate font-medium text-white !whitespace-nowrap !text-xs cursor-pointer",
            titleClassName,
          ].join(" ")}
        />
        {!isAllDay && showCalendarTime && (
          <Label
            label={[
              moment(start).format("HH:mm"),
              moment(end).format("HH:mm"),
            ].join("-")}
            className={[
              "truncate !whitespace-nowrap text-white  !text-xs cursor-pointer",
              orderStatus &&
              eventType === "MODULE.JOB" &&
              orderStatus === "closed"
                ? "decoration-2 line-through"
                : "",
              titleClassName,
            ].join(" ")}
          />
        )}
      </div>
    </button>
  );
};

export default EventView;
