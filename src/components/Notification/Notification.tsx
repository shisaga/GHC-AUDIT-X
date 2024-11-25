import { Avatar, Typography } from "@material-tailwind/react";
import moment from "moment";

import useNotification, { notificationRead } from "@/hooks/useNotification";
import { Sidebar } from "@/stories/Sidebar/Sidebar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/stories/Label/Label";
import LoadingSpinner from "../Common/LoadingSpinner";
import { getSpecificAudit } from "@/hooks/useAudit";
import { FaClock } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthProvider";


interface FilterSidebarProps {
  open: boolean;
  close: () => void;
  id?: string;
}

export const NotificationsMenu = ({ open, close }: FilterSidebarProps) => {
  const router = useRouter();
  const { userInfo } = useAuth();
  const { data, notReaded, loading, refetch } = useNotification();

  useEffect(() => {
    refetch();
  }, [open]);

  const handleReadedNotification = async (id: number) => {
    router.push("");
    await notificationRead(id);
    refetch();
  };
  function formatTimeDifference(timestamp: any) {
    const now = moment();
    const diffMinutes = now.diff(timestamp, "minutes");
    const diffHours = now.diff(timestamp, "hours");
    const diffDays = now.diff(timestamp, "days");
    const diffWeeks = now.diff(timestamp, "weeks");

    if (diffMinutes < 1) {
      return "few seconds ago";
    } else if (diffMinutes < 60) {
      return diffMinutes + " minutes ago";
    } else if (diffHours < 24) {
      return diffHours + " hours ago";
    } else if (diffDays < 7) {
      return diffDays + " days ago";
    } else {
      return diffWeeks + " weeks ago";
    }
  }

  const redirectionLink = async (id: any) => {
    const data = await getSpecificAudit(id);
    if (data.audit.auditType) {
      router.push(`/audits/${data.audit.auditType}/edit/${id}`);
      close();
    }
  };

  return (
    <Sidebar
      open={open}
      close={() => close()}
      title={`Notifications (${notReaded || 0})`}
      headerClassName={"!border-t-8"}
      contentClassName="!px-0 pb-0 pt-4 !bg-colorWhite"
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex flex-col p-4 gap-2">
            {data?.length > 0 ? (
              [
                ...data.filter((data: any) => !data?.readed),
                ...data.filter((data: any) => data?.readed),
              ].map((data: any) => (
                <>
                  <div
                    className="flex items-center gap-4 py-2 pl-2 pr-8 cursor-pointer hover:bg-colorLightest rounded-normal"
                    onClick={() => handleReadedNotification(data?.id)}
                  >
                    <div className="flex items-center justify-center">
                      {!data?.user?.imgUrl ? (
                        <span className="w-[50px] h-[50px] text-[25px] text-center bg-colorLighter text-colorGray rounded-full pt-[6px] font-medium">
                          {data?.user?.firstName?.charAt(0)?.toUpperCase()}
                          {data?.user?.lastName?.charAt(0)?.toUpperCase()}
                        </span>
                      ) : (
                        <Avatar
                          variant="circular"
                          alt="tania andrew"
                          className="cursor-pointer h-8 w-8 mr-2"
                          src={data?.user?.imgUrl}
                        />
                      )}
                    </div>
                    <div className="w-full flex flex-col gap-1">
                      <Typography
                        variant="small"
                        className={
                          data?.readed
                            ? "font-normal !text-colorBlack"
                            : "font-semibold"
                        }
                      >
                        <Label
                          size="small"
                          color="var(--color-neutral-700)"
                          label={data?.message || "-"}
                        />
 &nbsp;
                      {userInfo?.roles?.[0]?.name !== "Contractor"&& <span
                          className="underline text-themePrimary"
                          onClick={() => redirectionLink(data?.clientId)}
                        >
                          View
                        </span>}
                      </Typography>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                          <FaClock
                            color="var(--color-neutral-700)"
                            className="text-md"
                          />
                          <Label
                            size="small"
                            label={formatTimeDifference(data?.createdAt)}
                            color="var(--color-neutral-700)"
                          />
                        </div>
                        {!data?.readed && (
                          <div className="flex items-end justify-end w-2 h-2 rounded-full bg-themePrimary" />
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ))
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  <Label
                    label="Nothing New !"
                    className="font-semibold text-colorLight text-center"
                  />
                </div>
              </>
            )}
          </div>
        </>
      )}{" "}
    </Sidebar>
  );
};
