/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import LoadingSpinner from "@/components/Common/LoadingSpinner";
import { useAuth } from "@/contexts/AuthProvider";
import { useUpdateCompanySetting } from "@/hooks/useCompany";
import { Label } from "@/stories/Label/Label";
import { SidebarLink } from "@/stories/SidebarLink/SidebarLink";
import { CompanyInfo } from "@/types/company";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";
import {
  AiOutlineDashboard,
  AiOutlineSetting,
  AiOutlineTool,
} from "react-icons/ai";
import { FaArrowLeft, FaDollarSign } from "react-icons/fa";
import { HiOutlineBuildingOffice2, HiOutlineUsers } from "react-icons/hi2";
import { MdOutlineAssignment } from "react-icons/md";
import { SlCalender } from "react-icons/sl";

export interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
  companyInfo?: CompanyInfo;
}

export interface SidebarLinkProps {
  name: string;
  icon: React.ReactNode;
  to: string;
  hide?: boolean;
  isActive?: boolean;
}

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  companyInfo,
}: SidebarProps) => {
  const { userInfo } = useAuth();
  const pathname = usePathname();
  const sidebar = useRef<any>(null);
  const { isUpdatingCompanySetting } = useUpdateCompanySetting();

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", `${sidebarOpen}`);
    if (sidebarOpen) {
      document?.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document?.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarOpen]);

  const clickHandler = ({ target }: any) => {
    if (!sidebarOpen) return;
    if (
      target?.id &&
      (target.id === "header-button-hamburger-ref-svg" ||
        target.id === "header-button-hamburger-ref")
    ) {
      return;
    }
    setSidebarOpen(false);
  };

  // close on click outside
  useEffect(() => {
    if (window.innerWidth < 1024) {
      document.addEventListener("click", clickHandler);
      return () => document.removeEventListener("click", clickHandler);
    }
  });

  if (!userInfo) return null;

  const sideBarMenuItems: SidebarLinkProps[] = [
    {
      name: "Dashboard",
      icon: <AiOutlineDashboard className="text-lg" />,
      to: "/dashboard",
      isActive: pathname.includes("dashboard"),
      hide: userInfo?.roles?.[0].name === "Contractor",
    },
    {
      name: "Calendar",
      icon: <SlCalender className="text-lg" />,
      to: "/calendar",
      isActive: pathname.includes("calendar"),
      hide: userInfo?.roles?.[0].name === "Contractor",
    },
    {
      name: "Audits",
      icon: <MdOutlineAssignment className="text-lg" />,
      to: "/audits",
      isActive: pathname.includes("audits"),
    },
    {
      name: "Admins",
      icon: <HiOutlineUsers className="text-lg" />,
      to: "/admins",
      isActive: pathname.includes("admins"),
      hide: userInfo?.roles?.[0].name !== "Admin",
    },
    {
      name: "Managers",
      icon: <HiOutlineUsers className="text-lg" />,
      to: "/managers",
      isActive: pathname.includes("managers"),
      hide:
        userInfo?.roles?.[0].name === "Auditor" ||
        userInfo?.roles?.[0].name === "Contractor",
    },
    {
      name: "Auditors",
      icon: <HiOutlineUsers className="text-lg" />,
      to: "/auditors",
      isActive: pathname.includes("auditors"),
      hide:
        userInfo?.roles?.[0].name === "Auditor" ||
        userInfo?.roles?.[0].name === "Contractor",
    },
    {
      name: "Contractors",
      icon: <AiOutlineTool className="text-lg" />,
      to: "/contractors",
      isActive: pathname.includes("contractors"),
      hide:
        userInfo?.roles?.[0].name === "Auditor" ||
        userInfo?.roles?.[0].name === "Contractor",
    },
    {
      name: "Service Organization",
      icon: <HiOutlineBuildingOffice2 className="text-lg" />,
      to: "/service-organization",
      isActive: pathname.includes("service-organization"),
      hide: userInfo?.roles?.[0].name !== "Admin",
    },
    {
      name: "Accounting",
      icon: <FaDollarSign className="text-lg" />,
      to: "/accounting",
      isActive: pathname.includes("accounting"),
    },
    {
      name: "Settings",
      icon: <AiOutlineSetting className="text-lg" />,
      to: "/settings",
      isActive: pathname.includes("settings"),
      hide: userInfo?.roles?.[0].name !== "Admin",
    },
  ];
  return (
    <>
      <div
        className={`fixed inset-0 bg-gray-700 !bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>
      <div
        id="sidebar"
        ref={sidebar}
        className={`px-0 flex flex-col absolute z-40 border-r-1 border-r border-colorLighter left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 transform h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 shrink-0 bg-colorWhite !pt-0 p-4 !pb-0 transition-all duration-200 ease-in-out ${
          sidebarOpen
            ? "lg:sidebar-expanded:!w-64 2xl:!w-64 pr-0 translate-x-0"
            : "-translate-x-64"
        }`}
      >
        {isUpdatingCompanySetting ? (
          <LoadingSpinner />
        ) : (
          <>
            {sidebarOpen && (
              <div className="pr-3 sm:px-2 py-4 bg-colorWhite border-b border-b-colorLighter">
                <FaArrowLeft
                  size={18}
                  className="lg:hidden text-themePrimary mx-3"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                />
                {userInfo?.roles?.[0].name === "Admin" ? (
                  <Link
                    href="/settings"
                    className="w-full flex items-center justify-center"
                  >
                    <div className="">
                      <img
                        className="rounded-md h-[150px] w-[150px] object-cover object-center"
                        src={
                          companyInfo?.imgUrl ||
                          "/images/user-icon-placeholder.webp"
                        }
                        alt="User image"
                      />
                    </div>
                  </Link>
                ) : (
                  <div className="w-full flex items-center justify-center">
                    <img
                      className="rounded-md h-[150px] w-[150px] object-cover object-center"
                      src={
                        companyInfo?.imgUrl ||
                        "/images/user-icon-placeholder.webp"
                      }
                      alt="User image"
                    />
                  </div>
                )}

                <div className="mt-4">
                  <Label
                    label={companyInfo?.companyName}
                    className="font-semibold line-clamp-1 grow text-center"
                    size="medium"
                  />
                </div>
              </div>
            )}
          </>
        )}

        <ul className="no-scrollbar h-full flex flex-col overflow-y-auto duration-300 ease-linear my-3">
          {sideBarMenuItems
            .filter((item) => !item.hide)
            .map((item, index) => {
              return (
                <SidebarLink
                  key={index}
                  to={item.to}
                  icon={item.icon}
                  text={sidebarOpen ? item.name : ""}
                  isActive={item.isActive}
                />
              );
            })}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
