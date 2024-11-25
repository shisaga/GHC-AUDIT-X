/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect, useState } from "react";
import { weekdayNames } from "./Calendar";
import moment from "moment";
import EventView from "./EventView";
import { useMediaQuery } from "react-responsive";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { Button } from "@/stories/Button/Button";
import { Each } from "@/stories/Each/Each";
import { Label } from "@/stories/Label/Label";

interface Day {
  date: Date;
  isCurrentMonth: boolean;
  events: any[];
  isToday: boolean;
}

interface WeekAndDayViewProps {
  startDate: Date;
  selectedDate: Date;
  events: any[];
  handleEventClick: (event: any) => void;
  numberOfDays: number;
  scrollToTime?: string;
  setClickedDate: (date: Date) => void;
  setOpenCreateModuleModal: (value: boolean) => void;
  readOnlyCalendar?: boolean;
}

// Function to generate dynamic time slots
const generateTimeSlots = () => {
  const startTime = moment("12:00 AM", "hh:mm A");
  const endTime = moment("11:59 PM", "hh:mm A");
  const timeSlots = [];

  while (startTime.isBefore(endTime)) {
    timeSlots.push(startTime.format("h A"));
    startTime.add(60, "minutes");
  }

  return timeSlots;
};

const WeekAndDayView: React.FC<WeekAndDayViewProps> = ({
  startDate,
  selectedDate,
  events,
  handleEventClick,
  numberOfDays,
  scrollToTime,
  setClickedDate,
  setOpenCreateModuleModal,
  readOnlyCalendar,
}) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((cur) => !cur);
  const today = new Date();
  const days: Day[] = [];
  const timeSlots = generateTimeSlots();
  const isTablet = useMediaQuery({ maxWidth: 780 });

  for (let i = 0; i < numberOfDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate?.getDate() + i);
    const isCurrentMonth =
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear();
    const day = currentDate.getDate();
    const isToday =
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear();

    const dayObj: Day = {
      date: currentDate,
      isCurrentMonth,
      events: events.filter((event) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        return (
          (eventStart.getDate() === day &&
            eventStart.getMonth() === currentDate.getMonth() &&
            eventStart.getFullYear() === currentDate.getFullYear()) ||
          (eventEnd.getDate() === day &&
            eventEnd.getMonth() === currentDate.getMonth() &&
            eventEnd.getFullYear() === currentDate.getFullYear()) ||
          (eventStart < currentDate && eventEnd > currentDate)
        );
      }),
      isToday,
    };

    days.push(dayObj);
  }

  useEffect(() => {
    if (scrollToTime) {
      const myElement = document.getElementById(`time-label-${scrollToTime}`);
      if (myElement) {
        myElement.scrollIntoView({
          behavior: "smooth", // You can also use 'auto' or 'instant'
          block: "start", // You can also use 'center' or 'end'
        });
      }
    }
  }, []);

  const getAllDayEvents = (events: any[]): any[] => {
    const fullDayDuration = moment.duration(1, "day");

    return events
      .filter((event) => {
        if (numberOfDays === 7) {
          return (
            moment(event.start).isSameOrBefore(
              moment(selectedDate).endOf("week")
            ) &&
            moment(event.end).isSameOrAfter(
              moment(selectedDate).startOf("week")
            )
          );
        }
        return (
          moment(event.start).isSameOrBefore(
            moment(selectedDate).endOf("day")
          ) &&
          moment(event.end).isSameOrAfter(moment(selectedDate).startOf("day"))
        );
      })
      .filter((event) => {
        const eventStart = moment(event.start);
        const eventEnd = moment(event.end);

        // Check if the event has a duration greater than or equal to a full day
        return (
          eventEnd.diff(eventStart) >= fullDayDuration.asMilliseconds() - 60000
        );
      });
  };

  const doesEventContinueBeyondWeek = (
    event: any,
    currentWeekEndDate: Date
  ) => {
    const eventEnd = moment(event.end).endOf("day");
    const lastDayOfWeek = moment(currentWeekEndDate).endOf("day");

    return eventEnd.isAfter(lastDayOfWeek);
  };

  const doesEventStartBeforeWeek = (event: any, currentWeekStartDate: Date) => {
    const eventStart = moment(event.start).startOf("day");
    const firstDayOfWeek = moment(currentWeekStartDate).startOf("day");

    return eventStart.isBefore(firstDayOfWeek);
  };

  const renderLongEvents = () => {
    const allDayEventsForDay = getAllDayEvents(events);
    const maxEventsToShow = open ? allDayEventsForDay.length : 3;
    return (
      <div className="flex-grow mb-3">
        <div className="grid">
          {allDayEventsForDay.slice(0, maxEventsToShow).map((event) => {
            const isEventContinuingBeyondWeek = doesEventContinueBeyondWeek(
              event,
              days[days.length - 1].date
            );

            const isEventStartingBeforeWeek = doesEventStartBeforeWeek(
              event,
              days[0].date
            );

            const eventStart = moment.max([
              moment(event.start),
              moment(days[0].date).startOf("day"),
            ]);
            const eventEnd = moment.min([
              moment(event.end),
              moment(days[days.length - 1].date).endOf("day"),
            ]);
            const dayDifference = eventStart.diff(
              moment(days[0].date).startOf("day"),
              "days"
            );
            const dayDifferenceEnd = eventEnd.diff(
              moment(days[days.length - 1].date).endOf("day"),
              "days"
            );

            const leftPosition = dayDifference * (100 / numberOfDays) + "%";

            const width =
              (numberOfDays - dayDifference + dayDifferenceEnd) *
              (numberOfDays === 1 ? 100 : 14);

            return (
              <div
                key={event.id}
                className={[
                  "relative cursor-pointer rounded border min-h-[28px] ml-1 mb-1",
                  isEventContinuingBeyondWeek && "!rounded-r-xl",
                  isEventStartingBeforeWeek && "!rounded-l-xl",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{
                  borderColor: "#000",
                  left: leftPosition,
                  width: `${width}%`,
                }}
              >
                {/* Render the EventView component for each event */}
                <EventView
                  event={event}
                  handleEventClick={handleEventClick}
                  titleClassName="!whitespace-break-spaces"
                  parentClassName={[
                    isEventContinuingBeyondWeek && "!rounded-r-xl",
                    isEventStartingBeforeWeek && "!rounded-l-xl",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  className={[
                    numberOfDays === 1 && "!flex-row gap-2 items-center",
                    isTablet && "flex-wrap",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  isAllDay
                />
              </div>
            );
          })}
          {allDayEventsForDay?.length > 3 && (
            <div className="ml-1 mb-2">
              <Button
                label=""
                className="!text-white w-[24px] h-[24px] !rounded-full"
                backgroundColor="gray"
                variant="icon"
                size="large"
                icon={open ? <FaAngleUp /> : <FaAngleDown />}
                onClick={toggleOpen}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDayNames = () => (
    <Each
      of={days}
      render={({ date, isToday }: Day) => {
        const isPreviousDay = moment(date).isBefore(today);
        return (
          <div
            key={date.toISOString()}
            className="flex flex-col py-3 items-center h-full"
          >
            <Label
              label={weekdayNames[date?.getDay() || 0] || ""}
              size="small"
              className={`uppercase !text-xs sm:!text-sm ${
                isPreviousDay && !isToday ? "text-gray-500" : ""
              }`}
            />
            <Label
              label={date?.getDate().toString() || ""}
              className={`!text-xs sm:!text-sm font-semibold h-5 w-5 min-h-[20px] max-h-[20px] min-w-[20px] max-w-[20px] sm:h-8 sm:w-8 sm:min-h-[32px] sm:max-h-[32px] sm:min-w-[32px] sm:max-w-[32px] flex items-center justify-center rounded-full ${
                isPreviousDay ? "text-gray-500" : ""
              } ${isToday ? "bg-black text-white" : ""}`}
              size="large"
            />
          </div>
        );
      }}
    />
  );

  const renderTime = () => (
    <Each
      of={timeSlots}
      render={(timeSlot) => (
        <Label
          id={`time-label-${timeSlot}`}
          label={timeSlot}
          className="text-gray-500 text-right mr-2 h-16 whitespace-nowrap"
          size="small"
        />
      )}
    />
  );

  const renderDayTimeSlots = () => (
    <Each
      of={days}
      render={({ date, events, isToday }: Day) => {
        return (
          <div className="flex flex-col w-full relative">
            {renderDayTimeSlotBox(date)}
            {isToday && markCurrentTime()}
            {renderEvents(events, date)}
          </div>
        );
      }}
    />
  );

  const renderDayTimeSlotBox = (date: Date) => {
    const handleDateTimeClick = (time: string) => {
      const [rawHour, amPm] = time.split(" ");
      let hour = Number(rawHour);

      if (hour === 12) {
        hour = amPm === "AM" ? 0 : 12;
      } else if (amPm === "PM") {
        hour += 12;
      }

      const clickedDate = new Date(moment(date).hour(hour).valueOf());
      setOpenCreateModuleModal(true);
      setClickedDate(clickedDate);
    };

    return (
      <Each
        of={timeSlots}
        render={(timeSlot) => (
          <button
            id={[moment(date).format("DD-MM-yyyy"), timeSlot].join("-")}
            className="flex flex-col py-3 items-center h-16 cursor-pointer border"
            onClick={() => !readOnlyCalendar && handleDateTimeClick(timeSlot)}
          ></button>
        )}
      />
    );
  };

  const markCurrentTime = () => {
    const calculateCurrentTimePosition = (): number => {
      const currentTime = moment();
      const startOfDay = moment().startOf("day");
      const timeDifference = currentTime.diff(startOfDay, "minutes");
      const percentageOfDay = (timeDifference / (60 * 24)) * 100;
      return percentageOfDay;
    };

    return (
      <div
        className="absolute w-full z-[99] inline-flex items-center"
        style={{
          top: `${calculateCurrentTimePosition()}%`,
        }}
      >
        <div className="border border-red-500 w-full before:h-3 before:w-3 before:bg-red-600 before:flex h-0 before:-top-1 before:-left-2 before:rounded-full before:absolute"></div>
      </div>
    );
  };

  const removeAllDayEvents = (events: any[]): any[] => {
    return events.filter((event) => {
      const startMoment = moment(event.start);
      const endMoment = moment(event.end);
      // Exclude events that span at least one entire day
      return !endMoment.isSameOrAfter(startMoment.clone().endOf("day"));
    });
  };

  const renderEvents = (events: any[], date: Date) => {
    const calculateDuration = (event: any): number => {
      const startMoment = moment(event.start).startOf("minute");
      const endMoment = moment(event.end).endOf("minute");
      return endMoment.diff(startMoment, "minutes");
    };

    const doEventsOverlap = (eventA: any, eventB: any): boolean => {
      const startA = moment(eventA.start);
      const endA = moment(eventA.end);
      const startB = moment(eventB.start);
      const endB = moment(eventB.end);

      return startA.isSameOrBefore(endB) && endA.isSameOrAfter(startB);
    };

    const sortedEvents = events.sort((a: any, b: any) => {
      const durationA = calculateDuration(a);
      const durationB = calculateDuration(b);
      return durationB - durationA;
    });
    const withoutAllDay = removeAllDayEvents(sortedEvents);

    return (
      <Each
        of={withoutAllDay}
        render={(event, index) => {
          const { eventColor, start, end } = event;
          // Calculate the difference in minutes between event start and end date
          let eventStart = moment(start);
          let eventEnd = moment(end);
          // Adjust start time if it's before the current date
          if (eventStart.isBefore(moment(date), "day")) {
            eventStart = moment(eventStart).startOf("day");
          }
          // Adjust end time if it's after the current date
          if (eventEnd.isAfter(moment(date), "day")) {
            eventEnd = moment(eventEnd).endOf("day");
          }
          const startDifference = eventStart.diff(
            moment(start).startOf("day"),
            "minutes"
          );
          const endDifference = eventEnd.diff(
            moment(end).startOf("day"),
            "minutes"
          );
          // Calculate the top position based on the start time
          const topPosition = (startDifference / (60 * 24)) * 100;

          const eventHeight = (endDifference / (60 * 24)) * 100 - topPosition;
          // Check for overlapping events

          const overlappingEvents = withoutAllDay
            .slice(0, index)
            .filter((otherEvent: any) => {
              return doEventsOverlap(event, otherEvent);
            });
          const maxLeftSpacingPercentage =
            overlappingEvents.length === 0 ? 0 : 10; // Adjust the maximum left spacing percentage

          const leftSpacingPercentage = Math.min(
            maxLeftSpacingPercentage,
            (1 / (overlappingEvents.length + 1)) * 100
          );
          // Calculate left margin for overlapping events
          const leftPosition = (index * leftSpacingPercentage) % 100;
          // Calculate width based on the number of overlapping events
          const width = 100 - leftPosition;
          return (
            <div
              className="absolute cursor-pointer rounded border min-h-[35px]"
              style={{
                top: `${topPosition}%`,
                left: `${leftPosition}%`,
                height: `${eventHeight}% `,
                width: `${width}%`,
                zIndex: index + 1,
                borderColor: "#000",
                color: "#fff !important",
              }}
            >
              {/* Render the EventView component for each event */}
              <EventView
                event={event}
                handleEventClick={handleEventClick}
                titleClassName="!whitespace-break-spaces"
                className={[
                  numberOfDays === 1
                    ? "!flex-row rounded-normal  gap-2 items-center"
                    : "",
                  isTablet ? "flex-wrap" : "",
                ].join(" ")}
              />
            </div>
          );
        }}
      />
    );
  };

  return (
    <div className="flex flex-col h-full px-2 sm:px-4">
      <div className="flex">
        <div className="w-[50px]"></div>
        {/* Render day names */}
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: `repeat(${numberOfDays}, minmax(0, 1fr))`,
          }}
        >
          {renderDayNames()}
        </div>
      </div>
      <div className="flex">
        <div className="w-[50px]"></div>
        <div className="w-full">{renderLongEvents()}</div>
      </div>

      <div className="flex flex-col w-full overflow-auto pb-2">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `50px repeat(${numberOfDays}, minmax(0, 1fr))`,
          }}
        >
          {/* Render time slots */}
          <div className="flex flex-col">{renderTime()}</div>
          {/* Render days with time slot boxes */}
          {renderDayTimeSlots()}
        </div>
      </div>
    </div>
  );
};

export default WeekAndDayView;
