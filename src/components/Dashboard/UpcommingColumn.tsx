"use client";
import React, { useCallback } from "react";
import { Avatar } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { getSpecificAudit } from "@/hooks/useAudit";
import { formatAmount, fullNameFormatter } from "@/utils/CommonFunction";
import { SBTooltip } from "@/stories/Tooltip/Tooltip";
import { Label } from "@/stories/Label/Label";
import { useAuth } from "@/contexts/AuthProvider";

// eslint-disable-next-line react/display-name
const AuditInfoCard = React.memo(({ data }: any) => {
  const router = useRouter();
  const { userInfo } = useAuth();

  const handleGetAudit = async () => {
    return userInfo?.roles?.[0]?.name === "Contractor"
      ? null
      :  router.push(`/audits/${data?.auditType}/edit/${data?.clientId}`);
  };
  return (
    <div
      key={data.id}
      onClick={handleGetAudit}
      draggable={true}
      className={`w-full space-y-4 bg-white rounded-normal border-2 p-3 ${userInfo?.roles?.[0]?.name === "Contractor" ? "" : "cursor-pointer"}`}
    >
      <div className="flex flex-col">
        <Label label="Client" size="extra-small" className="text-colorLight" />
        <Label
          label={fullNameFormatter(data?.firstName, data?.lastName)}
          size="small"
          className="mt-1 text-themePrimary"
        />
        <Label label={data?.email} size="extra-small" />
      </div>
      <div>
        <Label label="Auditor" size="extra-small" className="text-colorLight" />
        <div className="text-[12px] flex gap-2 justify-start items-center">
          {data?.assignee?.imgurl ? (
            <Avatar
              src={
                data?.assignee?.imgurl
                  ? data?.assignee?.imgurl
                  : "https://docs.material-tailwind.com/img/face-4.jpg"
              }
              alt="avatar"
              size="xs"
            />
          ) : (
            <span className="w-8 h-8 text-sm text-center bg-colorLighter text-colorDark rounded-full pt-[6px] font-medium">
              {data?.assignee?.firstName?.charAt(0).toUpperCase()}
              {data?.assignee?.lastName?.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="flex flex-col">
            <Label
              label={fullNameFormatter(
                data?.assignee?.firstName,
                data?.assignee?.lastName
              )}
              size="extra-small"
            />
            <Label label={data?.assignee?.email} size="extra-small" />
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <Label
            label="Lead Type"
            size="extra-small"
            className="text-colorLight"
          />
          <Label label={data?.leadType} size="extra-small" />
        </div>
        <div className="flex flex-col">
          <Label
            label="Audit Cost"
            size="extra-small"
            className="text-colorLight"
          />
          <Label label={formatAmount(data?.auditCost)} size="extra-small" />
        </div>
      </div>
    </div>
  );
});

const UpcommingColumn = ({
  icon,
  title,
  colorClass,
  dataList,
  tooltipMessage,
}: {
  icon: any;
  title: string;
  colorClass: string;
  dataList: any;
  tooltipMessage?: string;
}) => {
  return (
    <div className="rounded-normal bg-[#F5F6FA] border">
      <div className="text-base w-full flex gap-2 justify-start items-center p-3 pb-0">
        <span id={`message-${title.split(" ")[0]}`}>{icon}</span>
        <SBTooltip
          place="bottom"
          message={tooltipMessage}
          id={`message-${title.split(" ")[0]}`}
          className="!text-xs"
        />
        {title}
        <span
          className={`${colorClass} w-[18px] h-[18px] text-xs flex justify-center items-center text-white font-medium rounded-full`}
        >
          {dataList?.length || 0}
        </span>
      </div>
      <hr className="mt-4 mb-5 border-t border-colorLight" />
      <div className="flex gap-3 flex-col p-3 pt-0 h-[80vh] overflow-auto">
        {dataList?.sort((a:any, b:any) => b?.auditDate - a?.auditDate).map((data: any) => (
          <AuditInfoCard key={data.id} data={data} />
        ))}
      </div>
    </div>
  );
};

export default UpcommingColumn;
