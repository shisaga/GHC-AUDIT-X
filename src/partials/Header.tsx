"use client";
import React, { useEffect } from "react";
import { BiMenuAltLeft } from "react-icons/bi";
import { SidebarProps } from "@/partials/Sidebar";
import { Button } from "@/stories/Button/Button";
import { Label } from "@/stories/Label/Label";
import { useAuth } from "@/contexts/AuthProvider";
import { SBTooltip } from "@/stories/Tooltip/Tooltip";
import { Avatar } from "@material-tailwind/react";
import MoreMenu, { MenuItemProps } from "@/components/Common/MoreMenu";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { NotificationsMenu } from "@/components/Notification/Notification";
import useNotification from "@/hooks/useNotification";
import { IoNotificationsCircleOutline } from "react-icons/io5";
import { fullNameFormatter } from "@/utils/CommonFunction";
import { useMediaQuery } from "react-responsive";

export const Header = ({
  sidebarOpen,
  setSidebarOpen,
  companyInfo,
}: SidebarProps) => {
  const { userInfo } = useAuth();
  const {
    data: notificationData,
    notReaded,
    loading,
    refetch,
  } = useNotification();
  const router = useRouter();
  const [notification, setNotification] = React.useState(false);
  const isMobile = useMediaQuery({ maxWidth: 480 });

  if (!userInfo) return null;

  const profileMenuItems: MenuItemProps[] = [
    {
      icon: <CgProfile className="text-lg" />,
      label: "Profile",
      clickAction: () => router.push("/profile"),
    },
    {
      icon: <FiLogOut className="text-lg" />,
      label: "Sign Out",
      clickAction: () => {
        deleteCookie("authKey");
        window.location.reload();
      },
    },
  ];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    userInfo.roles?.[0].name!=="Contractor" &&  refetch();
    userInfo.roles?.[0].name!=="Contractor" && setInterval(() => refetch(), 60000);
  }, []);

  return (
    <header className="flex-none flex justify-between gap-5 bg-white border-b border-colorLighter z-2 px-4 py-3">
      <div className="flex items-center grow gap-3">
        <Button
          label=""
          icon={
            <BiMenuAltLeft
              className="cursor-pointer"
              color="var(--color-primary)"
              size={25}
              id="header-button-hamburger-ref-svg"
            />
          }
          id="sidebar-expander-btn"
          className="flex-none"
          variant="icon"
          onClick={() => {
            setSidebarOpen(!sidebarOpen);
          }}
        />
        <SBTooltip
          place="bottom"
          opacity={100}
          message={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          id="sidebar-expander-btn"
          className="max-w-[200px] sm:max-w-full !text-xs bg-opacity-100 opacity-0"
        />

        {!sidebarOpen && (
          <div>
            <Label
              label={companyInfo?.companyName}
              className="font-semibold line-clamp-1 grow"
              size="small"
            />
          </div>
        )}
      </div>
      <div className="flex gap-5 items-center flex-none">
     {userInfo.roles?.[0].name!=="Contractor" &&   <div
          className="flex items-center cursor-pointer relative"
          onClick={() => setNotification(true)}
        >
          {notReaded > 0 && (
            <div className="!bg-colorDanger h-[15px] w-[15px] absolute flex justify-center items-center text-white top-0 right-0 !text-[10px] z-10 rounded-full">
              {notReaded || 0}
            </div>
          )}
          <IoNotificationsCircleOutline
            color="var(--color-black)"
            className="text-3xl"
          />
        </div>}

        <div className="flex items-center">
          <div
            className={`${isMobile ? "hidden" : "flex items-center justify-center"}`}
          >
            {!userInfo?.imgUrl ? (
              <span className="w-8 h-8 text-sm text-center bg-colorLighter text-colorGray rounded-full pt-[6px] font-medium">
                   {userInfo?.firstName?.charAt(0)?.toLocaleUpperCase()}
                    {userInfo?.lastName?.charAt(0)?.toLocaleUpperCase()}
              </span>
            ) : (
              <Avatar
                variant="circular"
                alt="tania andrew"
                className="cursor-pointer h-8 w-8 mr-2 focus-visible:"
                src={userInfo?.imgUrl}
              />
            )}
          </div>
          <div>
            <MoreMenu
              actionElement={
                !isMobile ? (
                  <Label
                    label={fullNameFormatter(
                      userInfo?.firstName,
                      userInfo?.lastName
                    )}
                    color="var(--color-neutral-700)"
                  />
                ) : !userInfo?.imgUrl ? (
                  <span className="w-8 h-8 text-sm text-center bg-colorLighter text-colorGray rounded-full pt-[6px] font-medium">
                    {userInfo?.firstName?.charAt(0)?.toLocaleUpperCase()}
                    {userInfo?.lastName?.charAt(0)?.toLocaleUpperCase()}
                  </span>
                ) : (
                  <Avatar
                    variant="circular"
                    alt="tania andrew"
                    className="cursor-pointer h-8 w-8 mr-2 focus-visible:"
                    src={userInfo?.imgUrl}
                  />
                )
              }
              arrowIcon={true}
              actionElementClass="!bg-white py-[10px] focus md:px-4 px-0 text-base !w-fit max-h-[44px] focus:outline-none"
              items={profileMenuItems}
              placement="bottom-end"
            />
          </div>
        </div>
      </div>
      <NotificationsMenu
        open={notification}
        close={() => {
          refetch();
          setNotification(false);
        }}
      />
    </header>
  );
};
