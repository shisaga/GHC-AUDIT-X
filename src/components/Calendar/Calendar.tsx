/* eslint-disable no-constant-condition */
"use client";
import { useEffect, useMemo, useState } from "react";
import moment from "moment-timezone";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useMediaQuery } from "react-responsive";
import MonthView from "./MonthView";
import CalendarActions from "./CalendarActions";
import WeekAndDayView from "./WeekAndDayView";
import ListView from "./ListView";
import { useQueryClient } from "react-query";
import { Label } from "@/stories/Label/Label";
import { Heading } from "@/stories/Heading/Heading";
import { useAuth } from "@/contexts/AuthProvider";
import LoadingSpinner from "../Common/LoadingSpinner";
import CalendarItemViewSidebar from "./CalendarItemViewSidebar";
import useCalander from "@/hooks/useCalander";
import { fullNameFormatter } from "@/utils/CommonFunction";

export interface CalendarEventTypes {
  id: string;
  start: Date | number | string;
  title: string;
  eventColor: string;
  eventType: any;
  end: Date | number | string;
  orderStatus?: string;
  audit?: number;
  auditMode?: string;
  auditorEA: string;
}

interface CalendarProps {
  showTodayButton?: boolean;
  showNextPrevButtons?: boolean;
  showMoreActions?: boolean;
  readOnlyCalendar?: boolean;
  showViewButtons?: boolean;
}

type ViewTypes = "week" | "month" | "day" | "list";

export const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const calenderViews: ViewTypes[] = ["day", "week", "month", "list"];

export const calenderModalTitle = (date?: Date) => (
  <div className="flex flex-col items-center w-full gap-1">
    <Label
      label={weekdayNames[date?.getDay() ?? 0] ?? ""}
      size="small"
      className="uppercase"
    />
    <Heading label={date?.getDate().toString() ?? ""} type="h3" />
  </div>
);

const handleStartEndDate = (selectedDate: Date, selectedView: ViewTypes) => {
  const selectedMoment = moment(selectedDate);

  if (selectedView === "month") {
    const firstDayOfMonth = selectedMoment.clone().startOf("month");
    const startDate = firstDayOfMonth.clone().startOf("week").valueOf();

    const lastDayOfMonth = selectedMoment.clone().endOf("month");
    const endDate = lastDayOfMonth.clone().endOf("week").valueOf();

    return { startDate, endDate };
  } else if (selectedView === "week") {
    const weekStartDate = selectedMoment.clone().startOf("week").valueOf();
    const weekEndDate = selectedMoment.clone().endOf("week").valueOf();

    return { startDate: weekStartDate, endDate: weekEndDate };
  } else if (selectedView === "day") {
    const dayStartTime = selectedMoment.clone().startOf("day").valueOf();
    const dayEndTime = selectedMoment.clone().endOf("day").valueOf();

    return { startDate: dayStartTime, endDate: dayEndTime };
  } else {
    const startDate = selectedMoment.clone().startOf("month").valueOf();
    const endDate = selectedMoment.clone().endOf("month").valueOf();

    return { startDate, endDate };
  }
};

const getView = (
  isMobile: boolean,
  isTablet: boolean,
  showCalendarTime: boolean
) => {
  if (isMobile) {
    return "list";
  } else if (isTablet && showCalendarTime) {
    return "week";
  } else {
    return "month";
  }
};

const Calendar: React.FC<CalendarProps> = ({
  showNextPrevButtons,
  showTodayButton,
  showMoreActions,
  readOnlyCalendar,
  showViewButtons,
}) => {
  const { userInfo } = useAuth();
  const currentMonthDate = new Date();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ maxWidth: 1224 });
  const { data: auditsData, loading } = useCalander(userInfo?.organizationId);
  const [selectedAudit, setSelectedAudit] = useState({});
  const isJobCalendarView = false;
  const showCalendarTime = true;
  const userTimezone = moment.tz.guess();
  const queryClient = useQueryClient();
  const [CalendarLoading, setCalnaderLoading] = useState(false);
  const [auditList, setAuditList] = useState<any>([]);
  const [evnetList, setEventList] = useState<any>([]);
  const [showAuditJob, setOpenJobDetailSidebar] = useState(false);

  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(currentMonthDate);

  const [clickedDate, setClickedDate] = useState<Date | undefined>(
    currentMonthDate
  );

  const [selectedView, setSelectedView] = useState<ViewTypes>(
    getView(isMobile, isTablet, showCalendarTime)
  );
  const [startDate, setStartDate] = useState<number>(
    handleStartEndDate(selectedDate, selectedView).startDate
  );
  const [endDate, setEndDate] = useState<number>(
    handleStartEndDate(selectedDate, selectedView).endDate
  );
  const [filteredColor, setFilteredColor] = useState<any>({
    color: "",
    text: "",
  });

  useEffect(() => {
    setCalnaderLoading(loading);
  }, [loading]);

  useEffect(() => {
    // fetchAllAuditData()
    if (auditsData) {
      setCalnaderLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setAuditList(auditsData);
      setCalnaderLoading(false);
    }
  }, [auditsData]);

  useEffect(() => {
    const newDataList: any = [];
    if (auditList.length > 0) {
      auditList.map((data: any) => {
        const tempData = {
          id: data?.client?.id,
          title: fullNameFormatter(
            data?.client?.firstName,
            data?.client?.lastName
          ),

          eventColor: data?.auditCalanderSetting?.color || "#406ae8",
          auditType: data?.auditType,
          audit: data?.audit,
          auditMode:
            data?.auditType === "single"
              ? data.auditMode
              : data.auditMode + "D-E",
          auditor: fullNameFormatter(
            data?.auditor?.firstName,
            data?.auditor?.lastName
          ),
          auditorEA: data?.auditor?.EANumber,
          contractor: fullNameFormatter(
            data?.contractor?.firstName,
            data?.contractor?.lastName
          ),
          paid: data?.paid,
          start: data?.startTime,
          end: data?.endTime,
          orderStatus: data?.auditor?.firstName ? "Assigned" : "unAssigned",
          client: data.client,
        };
        newDataList.push(tempData);
      });
    }
    setEventList([...newDataList]);
  }, [auditList]);

  useEffect(() => {
    const { startDate, endDate } = handleStartEndDate(
      selectedDate,
      selectedView
    );
    setStartDate(startDate);
    setEndDate(endDate);
  }, [selectedDate]);

  useEffect(() => {
    const view = getView(isMobile, isTablet, showCalendarTime);
    handleCalenderView(view);
  }, [isMobile, isTablet]);

  const handleEventClick = (event: CalendarEventTypes) => {
    setOpenJobDetailSidebar(true);
    setSelectedAudit(event);
  };

  const handleCalenderView = (view: ViewTypes) => {
    const { startDate, endDate } = handleStartEndDate(selectedDate, view);
    setStartDate(startDate);
    setEndDate(endDate);
    setSelectedView(view);
  };

  const renderCalenderView = () => {
    if (selectedView === "month") {
      return (
        <MonthView
          selectedDate={selectedDate}
          clickedDate={clickedDate}
          setClickedDate={(date) => setClickedDate(date)}
          events={[...evnetList]}
          handleEventClick={handleEventClick}
          setOpenCreateModuleModal={(value) => console.log("working month")}
          readOnlyCalendar={readOnlyCalendar}
        />
      );
    } else if (selectedView === "week" || selectedView === "day") {
      return (
        <WeekAndDayView
          events={[...evnetList]}
          handleEventClick={handleEventClick}
          numberOfDays={selectedView === "week" ? 7 : 1}
          selectedDate={selectedDate}
          startDate={new Date(startDate)}
          scrollToTime="7 AM"
          setOpenCreateModuleModal={(value) => console.log("working")}
          setClickedDate={(date) => setClickedDate(date)}
          readOnlyCalendar={readOnlyCalendar}
        />
      );
    } else {
      return (
        <ListView
          events={[...evnetList]}
          startDate={new Date(startDate)}
          endDate={new Date(endDate)}
          handleEventClick={handleEventClick}
          filteredColor={filteredColor}
          setFilteredColor={setFilteredColor}
        />
      );
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className={`flex flex-col gap-3 h-full w-full pt-3 ${
          selectedView === "month" ? "h-[700px]" : ""
        }`}
      >
        <CalendarActions
          disableActions={false}
          setSelectedDate={setSelectedDate}
          selectedDate={selectedDate}
          selectedView={selectedView}
          setSelectedView={(view) => handleCalenderView(view)}
          filteredColor={filteredColor}
          setFilteredColor={setFilteredColor}
          showTodayButton={showTodayButton}
          showNextPrevButtons={showNextPrevButtons}
          showViewButtons={showViewButtons}
          showMoreActions={showMoreActions}
          setOpenUnscheduleJobSidebar={(value) => console.log(value)}
          readOnlyCalendar={readOnlyCalendar}
        />
        <div className="flex h-full grow overflow-hidden gap-2">
          <div className="h-full bg-white overflow-hidden w-full">
            {!loading ? (
              renderCalenderView()
            ) : (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
              </div>
            )}
          </div>
          <CalendarItemViewSidebar
            open={showAuditJob}
            data={selectedAudit}
            close={() => setOpenJobDetailSidebar(false)}
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default Calendar;
