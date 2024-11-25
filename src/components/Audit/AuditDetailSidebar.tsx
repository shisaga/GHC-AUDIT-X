"use client";
import { Sidebar } from "@/stories/Sidebar/Sidebar";
import React from "react";
import { Button } from "@/stories/Button/Button";
import { useRouter } from "next/navigation";
import { Label } from "@/stories/Label/Label";
import { Card } from "@/stories/Card/Card";
import {
  dateTimeFormatter,
  EANumberFormatter,
  formatAmount,
  fullNameFormatter,
} from "@/utils/CommonFunction";
import { DATE_FORMAT } from "@/types/enums";
import { useAuth } from "@/contexts/AuthProvider";

interface AuditDetailSidebarProps {
  open: boolean;
  close: () => void;
  data?: any;
}

const AuditDetailSidebar = ({ open, close, data }: AuditDetailSidebarProps) => {
  const router = useRouter();
  const { userInfo } = useAuth();

  const auditModeValue = data?.auditMode === "D" ? "d" : "e";

  return (
    <Sidebar
      open={open}
      close={() => close()}
      title={"Audit Details"}
      headerClassName={"!border-t-8"}
      contentClassName="px-0 pb-0 pt-4"
    >
      <form className="flex h-full flex-col gap-5">
        <div className="overflow-auto h-full space-y-2">
          <div className="flex grow flex-col overflow-auto gap-4 px-3 pb-4">
            <Card className="!bg-colorLightest !px-5 !py-2 rounded-normal !border-0 !shadow-none">
              <div className="flex justify-between border-b py-2 gap-4">
                <Label
                  label="Audit Mode"
                  className="font-medium whitespace-nowrap"
                />
                <Label
                  label={data?.auditMode || "-"}
                  className="text-right capitalize"
                />
              </div>
              <div className="flex justify-between border-b py-2 gap-4">
                <Label
                  label="Assigned"
                  className="font-medium whitespace-nowrap"
                />
                <Label
                  label={fullNameFormatter(
                    data?.auditor?.firstName,
                    data?.auditor?.lastName
                  )}
                  className="text-right capitalize"
                />
              </div>
              <div className="flex justify-between border-b py-2 gap-4">
                <Label
                  label="Contractor"
                  className="font-medium whitespace-nowrap"
                />
                <Label
                  label={fullNameFormatter(
                    data?.contractor?.firstName,
                    data?.contractor?.lastName
                  )}
                  className="text-right capitalize"
                />
              </div>
              <div className="flex justify-between items-center border-b py-2">
                <Label label="Audit#" className="font-medium" />
                <Label
                  label={EANumberFormatter(
                    data?.auditor?.EANumber,
                    data?.auditMode,
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
                  label={dateTimeFormatter(DATE_FORMAT.DATE, data?.auditDate)}
                />
              </div>
              <div className="flex items-center justify-end border-b pb-2">
                <Label
                  label={
                    dateTimeFormatter(DATE_FORMAT.TIME, data?.startTime) +
                    "-" +
                    dateTimeFormatter(DATE_FORMAT.TIME, data?.endTime)
                  }
                />
              </div>

              <div className="flex justify-between border-b py-2 gap-4">
                <Label
                  label="Audit Cost"
                  className="font-medium whitespace-nowrap"
                />
                <Label
                  label={formatAmount(data?.auditCost)}
                  className="text-right capitalize"
                />
              </div>
              <div className="flex justify-between py-2 gap-4">
                <Label
                  label="Created At"
                  className="font-medium whitespace-nowrap"
                />
                <Label
                  label={dateTimeFormatter(
                    DATE_FORMAT.DATE_AND_TIME,
                    data?.createdAt
                  )}
                  className="text-right capitalize"
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

              {/* )} */}
              <div className="flex justify-between border-b py-2">
                <Label label="Phone" className="font-medium" />
                <Label
                  className="capitalize"
                  label={data?.client?.mobile || "-"}
                />
              </div>
              <div className="flex justify-between py-2 gap-10">
                <Label
                  label="Address"
                  className="font-medium whitespace-nowrap"
                />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${[data?.client?.streetAddress, data?.client?.city, data?.client?.province, data?.client?.country, data?.client?.postalCode].filter(Boolean).join(", ")}`}
                  target="_blank"
                  className="text-end"
                >
                  <Label
                    label={[
                      data?.client?.unit,
                      data?.client?.streetAddress,
                      data?.client?.city,
                      data?.client?.province,
                      data?.client?.country,
                      data?.client?.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                    className="text-justify text-themePrimary capitalize cursor-pointer"
                  />
                </a>
              </div>
            </Card>
          </div>
        </div>
        <div
          className={"flex-none flex gap-2 bg-white px-4 py-3 justify-end"}
          style={{ boxShadow: "0px -1px 0px 0px rgba(0, 0, 0, 0.15)" }}
        >
          <Button
            label="Close"
            size="large"
            onClick={() => close()}
            variant="outline-gray"
            className="hover:bg-colorLightest"
          />
          <Button
            label={"Edit"}
            size="large"
            onClick={() =>
              router.push(`/audits/${data.auditType}/edit/${data.clientId}`)
            }
            type="button"
            className="hover:bg-hoverPrimary"
            hide={userInfo?.roles?.[0]?.name === "Contractor"}
          />
        </div>
      </form>
    </Sidebar>
  );
};

export default AuditDetailSidebar;
