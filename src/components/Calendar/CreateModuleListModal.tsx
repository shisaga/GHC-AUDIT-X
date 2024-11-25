import React from "react";

import { FaBriefcase, FaTasks } from "react-icons/fa";

import moment from "moment";
import { useAuth } from "@/contexts/AuthProvider";
import { Label } from "@/stories/Label/Label";
import { Modal } from "@/stories/Modal/Modal";

interface CreateModuleListModalProps {
  open: boolean;
  close: () => void;
  title: React.ReactNode;
  date?: Date;
  hideOverlay?: boolean;
  selectedView: "week" | "month" | "day" | "list";
}

const CreateModuleListModal = ({
  open,
  close,
  title,
  date,
  hideOverlay,
  selectedView,
}: CreateModuleListModalProps) => {
  const { userInfo } = useAuth();
  const showCalendarTime = true;

  // const handleNavigate = (module: "job" | "task") => {
  //   if (!showCalendarTime || domainCheck(userInfo?.domain, [Domain.ORRC])) {
  //     navigate(
  //       `/${module}/date/${Number(
  //         moment(date).hour(12).minute(0).second(0).millisecond(0)
  //       )}`
  //     );
  //   } else if (selectedView === "month" || selectedView === "list") {
  //     navigate(
  //       `/${module}/date/${Number(
  //         moment(date).hour(7).minute(0).second(0).millisecond(0)
  //       )}`
  //     );
  //   } else {
  //     navigate(`/${module}/date/${Number(moment(date))}`);
  //   }
  // };

  return (
    <Modal
      open={open}
      close={close}
      title={title}
      hideOverlay={hideOverlay}
      className="z-[100]"
      panelClassName="px-2 border !max-w-[250px]"
      hideCloseButton
    >
      <div className="flex flex-col gap-1">
        <button
          className="flex items-center gap-2 hover:bg-lightThemeColor cursor-pointer p-2 rounded border-b w-full justify-center"
        // onClick={() => handleNavigate("task")}
        >
          <FaTasks />
          <Label
            label="Create Task"
            className="cursor-pointer whitespace-nowrap"
          />
        </button>
        <button
          className="flex items-center gap-2 hover:bg-lightThemeColor cursor-pointer p-2 rounded w-full justify-center"
        // onClick={() => handleNavigate("job")}
        >
          <FaBriefcase />
          <Label
            label="Create Job"
            className="cursor-pointer whitespace-nowrap"
          />
        </button>
      </div>
    </Modal>
  );
};

export default CreateModuleListModal;
