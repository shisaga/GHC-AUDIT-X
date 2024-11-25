import React from "react";

import CalendarEventList from "./CalendarEventList";
import { Modal } from "@/stories/Modal/Modal";
import { IoMdClose } from "react-icons/io";

interface DayEventListModalProps {
  open: boolean;
  close: () => void;
  title: React.ReactNode;
  eventList: any[];
  handleEventClick: (event: any) => void;
}

const DayEventListModal = ({
  open,
  close,
  eventList,
  title,
  handleEventClick,
}: DayEventListModalProps) => {
  return (
    <Modal
      open={open}
      close={close}
      title={title}
      panelClassName="px-2 border"
      hideCloseButton
      
      
    >
  
  {/* <IoMdClose  className="text-[40px]" /> */}
      <div className="flex flex-col gap-1 relative">
      <IoMdClose  className="text-[20px] cursor-pointer absolute top-[-70px] right-[10px]"  onClick={close} />
        <CalendarEventList
          events={eventList}
          handleEventClick={handleEventClick}
        />
      </div>
    </Modal>
  );
};

export default DayEventListModal;
