import { Card } from "@/stories/Card/Card";
import { Heading } from "@/stories/Heading/Heading";
import React, { useEffect, useMemo, useState } from "react";
import { BsCardChecklist } from "react-icons/bs";
import { FiInfo } from "react-icons/fi";
import UpcommingColumn from "./UpcommingColumn";
import LoadingSpinner from "../Common/LoadingSpinner";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useMediaQuery } from "react-responsive";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { STATUS_BG_COLOR } from "@/utils/constant";

const Upcoming = ({ data: jsonData, loading }: any) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ maxWidth: 1224 });
  const [upcommigData, setUpcommingData] = useState(jsonData);
  const [swiperInstance, setSwiperInstance] = useState<any>();

  const data = useMemo(
    () => [
      {
        icon: <FiInfo className="text-lg" />,
        title: "Assigned",
        key: "Assignee",
        colorClass: "bg-purple-200",
        tooltipMessage: "Assigned and status is In progress",
      },
      {
        icon: <FiInfo className="text-lg" />,
        title: "10 Days",
        key: "10 Days Ago",
        colorClass: "bg-[#FFC591]",
        tooltipMessage: "10 days passed since audit date",
      },
      {
        icon: <FiInfo className="text-lg" />,
        title: "14 Days",
        key: "14 Days Ago",
        colorClass: "bg-red-200",
        tooltipMessage: "14 days passed since audit date",
      },
      {
        icon: <BsCardChecklist />,
        title: "Processed",
        key: "Processed",
        colorClass: "bg-[#12A8B7]",
        tooltipMessage: "Audit status is Processed",
      },
      {
        icon: <BsCardChecklist />,
        title: "Submitted",
        key: "Submitted",
        colorClass: "bg-[#4ae16b9e]",
        tooltipMessage: "Audit status is Submitted",
      },
      {
        icon: <BsCardChecklist />,
        title: "Approved",
        key: "Approved",
        colorClass: "bg-[#26B846]",
        tooltipMessage: "Audit status is Approved",
      },
      {
        icon: <BsCardChecklist />,
        title: "Rejected",
        key: "Rejected",
        colorClass: "bg-[#E84848]",
        tooltipMessage: "Audit status is Rejected",
      },
      {
        icon: <BsCardChecklist />,
        title: "Waiting",
        key: "Waiting",
        colorClass: "bg-[#ffc107]",
        tooltipMessage: "Audit status is Waiting",
      },
      {
        icon: <BsCardChecklist />,
        title: "Cancelled",
        key: "Cancelled",
        colorClass: "bg-[#5A5A5A]",
        tooltipMessage: "Audit status is Cancelled",
      },
      {
        icon: <BsCardChecklist />,
        title: "Closed",
        key: "Closed",
        colorClass: "bg-[#5A5A5A3D]",
        tooltipMessage: "Audit status is Closed",
      },
    ],
    []
  );

  useEffect(() => {
    if (jsonData) {
      setUpcommingData(jsonData?.data?.upcomingData);
    }
  }, [jsonData?.data?.upcomingData]);

  return (
    <div id="upcommig">
      <Card className="p-4 space-y-4 overflow-auto">
        <div className="w-full flex justify-between items-center">
          <Heading type="h5" label="Upcoming" />
          <div className="flex gap-4">
            <div
              className="border cursor-pointer w-[40px] h-[40px] flex justify-center items-center rounded-normal"
              onClick={() => swiperInstance && swiperInstance?.slidePrev()}
            >
              <MdKeyboardArrowLeft size={30} />
            </div>
            <div
              className="border cursor-pointer  w-[40px] h-[40px] flex justify-center items-center rounded-normal"
              onClick={() => swiperInstance && swiperInstance?.slideNext()}
            >
              <MdKeyboardArrowRight size={30} />
            </div>
          </div>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="flex gap-3 overflow-scroll w-full ">
            {
              <Swiper
                onSwiper={(e) => setSwiperInstance(e)}
                slidesPerView={isMobile ? 1 : isTablet ? 3 : 4}
                // slidesPerGroup={isMobile ? 1 : 4}
                spaceBetween={20}
                className="mySwiper w-full "
              >
                {data.map((item, index) => (
                  <div className="block md:hidden" key={index}>
                    <SwiperSlide>
                      <UpcommingColumn
                        key={item.title}
                        icon={item?.icon}
                        title={item?.title}
                        colorClass={item?.colorClass}
                        dataList={upcommigData ? upcommigData[item?.key] : []}
                        tooltipMessage={item?.tooltipMessage}
                      />
                    </SwiperSlide>
                  </div>
                ))}
              </Swiper>
            }
          </div>
        )}
      </Card>
    </div>
  );
};

export default Upcoming;
