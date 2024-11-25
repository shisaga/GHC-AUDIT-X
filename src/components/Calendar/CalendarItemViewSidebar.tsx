import React, { useState } from "react";
import { Card, Chip } from "@material-tailwind/react";
import { Label } from "@/stories/Label/Label";
import { Sidebar } from "@/stories/Sidebar/Sidebar";
import LoadingSpinner from "../Common/LoadingSpinner";
import { Button } from "@/stories/Button/Button";
import { useRouter } from "next/navigation";
import {
  EANumberFormatter,
  dateTimeFormatter,
  fullNameFormatter,
} from "@/utils/CommonFunction";
import Link from "next/link";
import { DATE_FORMAT } from "@/types/enums";
import { useAuth } from "@/contexts/AuthProvider";

interface CalendarItemViewSidebarProps {
  open: boolean;
  close: () => void;
  data: any;
}

const CalendarItemViewSidebar: React.FC<CalendarItemViewSidebarProps> = ({
  open,
  close,
  data,
}: CalendarItemViewSidebarProps) => {
  const { userInfo } = useAuth();
  const router = useRouter();
  const [isLoadingTask, setIsLoadingTask] = useState<boolean>(false);

  return (
    <>
      <Sidebar
        open={open}
        close={() => close()}
        title={`Audit Detail`}
        className="z-[100]"
        headerClassName={"!border-t-8"}
        contentClassName="px-0 pb-0"
      >
        <div className="flex h-full flex-col gap-5">
          {isLoadingTask ? (
            <div className="h-full flex-center-center">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="flex grow flex-col overflow-auto gap-4 px-3 pb-4">
                <Card className="!bg-colorLightest !px-5 !py-2 rounded-normal !border-0 !shadow-none">
                  <div className="flex justify-between border-b py-2 gap-4">
                    <Label
                      label="Audit Mode"
                      className="font-medium whitespace-nowrap"
                    />
                    <Label
                      label={data?.auditMode?.split("")[0] || "-"}
                      className="text-right capitalize"
                    />
                  </div>
                  <div className="flex justify-between border-b py-2 gap-4">
                    <Label
                      label="Audit Type"
                      className="font-medium whitespace-nowrap"
                    />
                    <Label
                      label={data?.auditType || "-"}
                      className="text-right capitalize"
                    />
                  </div>
                  <div className="flex justify-between border-b py-2 gap-4">
                    <Label
                      label="Assigned"
                      className="font-medium whitespace-nowrap"
                    />
                    <Label
                      label={data?.auditor || "-"}
                      className="text-right capitalize"
                    />
                  </div>
                  <div className="flex justify-between border-b py-2 gap-4">
                    <Label
                      label="Contractor"
                      className="font-medium whitespace-nowrap"
                    />
                    <Label
                      label={data?.contractor || "-"}
                      className="text-right capitalize"
                    />
                  </div>
                  <div className="flex justify-between items-center border-b py-2">
                    <Label label="Audit#" className="font-medium" />
                    <Label
                      label={EANumberFormatter(
                        data?.auditorEA,
                        data?.auditMode?.split("")[0],
                        data?.audit
                      )}
                    />
                  </div>

                  <div className="flex justify-between pt-2">
                    <Label
                      label="Audit Date"
                      className="font-medium whitespace-nowrap"
                    />
                    <Label
                      label={dateTimeFormatter(DATE_FORMAT.DATE, data?.start)}
                    />
                  </div>
                  <div className="flex items-center justify-end pb-2">
                    <Label
                      label={
                        dateTimeFormatter(DATE_FORMAT.TIME, data?.start) +
                        " - " +
                        dateTimeFormatter(DATE_FORMAT.TIME, data?.end)
                      }
                    />
                  </div>

                  <div className="flex justify-between pt-2">
                    <Label
                      label="Payment Status"
                      className="font-medium whitespace-nowrap"
                    />

                    <Chip
                      className={`${
                        data?.paid ? "bg-[#26B846]" : "bg-[#ffc107]"
                      } !text-white font-bold w-fit min-w-[70px] capitalize text-center`}
                      value={data.paid ? "Paid" : "Unpaid"}
                    />
                  </div>
                </Card>

                <Card className="!bg-colorLightest !px-5 !py-2 rounded-normal !shadow-none !border-0">
                  <div className="flex justify-between border-b py-2">
                    <Label label="Client Name" className="font-medium" />
                    <Label
                      className="capitalize"
                      label={fullNameFormatter(
                        data?.client?.firstName,
                        data?.client?.lastName
                      )}
                    />
                  </div>
                  <div className="flex justify-between border-b py-2">
                    <Label label="Email" className="font-medium " />
                    <Label label={data?.client?.email || "-"} />
                  </div>

                  <div className="flex justify-between border-b py-2">
                    <Label label="Phone" className="font-medium" />

                    <Label label={data?.client?.mobile || "-"} />
                  </div>
                  <div className="flex justify-between py-2 gap-10">
                    <Label
                      label="Address"
                      className="font-medium whitespace-nowrap"
                    />
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${[data?.client?.streetAddress, data?.client?.city, data?.client?.province, data?.client?.country, data?.client?.postalCode].filter(Boolean).join(", ")}`}
                      target="_blank"
                      className="text-end"
                    >
                      <Label
                        label={[
                          data?.client?.unit,
                          data?.client?.streetAddress,
                          data?.clinet?.city,
                          data?.client?.province,
                          data?.client?.country,
                          data?.client?.postalCode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                        className="text-justify text-themePrimary cursor-pointer"
                      />
                    </Link>
                  </div>
                </Card>
              </div>
              <div
                className={
                  "flex-none flex gap-2 bg-white px-4 py-3 justify-end"
                }
                style={{ boxShadow: "0px -1px 0px 0px rgba(0, 0, 0, 0.15)" }}
              >
                <Button
                  label="Close"
                  size="large"
                  onClick={() => close()}
                  variant="outline-gray"
                  className="hover:bg-colorLightest"
                />
          { userInfo?.roles?.[0].name !== "Auditor"  &&       <Button
                  label="Edit Audit"
                  size="large"
                  className="w-50  !text-[white] !bg-themePrimary  !rounded-normal"
                  variant="outline-danger"
                  onClick={() =>
                    router.push(`/audits/${data?.auditType}/edit/${data?.id}`)
                  }
                />}
              </div>
            </>
          )}
        </div>
      </Sidebar>
    </>
  );
};

export default CalendarItemViewSidebar;
