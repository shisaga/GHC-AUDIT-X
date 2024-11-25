import Calendar from "@/components/Calendar/Calendar";
import React from "react";

const page = () => {
  return (
    <Calendar
      showNextPrevButtons
      showTodayButton
      showMoreActions
      readOnlyCalendar={false}
      showViewButtons={true}
    />
  );
};

export default page;
