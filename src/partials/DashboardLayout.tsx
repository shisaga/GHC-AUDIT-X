/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Sidebar from "@/partials/Sidebar";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import { Header } from "./Header";
import { useMediaQuery } from "react-responsive";
import { useAuth } from "@/contexts/AuthProvider";
import LoadingSpinner from "@/components/Common/LoadingSpinner";
import { useGetCompanySetting } from "@/hooks/useCompany";
import { CompanyInfo } from "@/types/company";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { getCompanyInfo, isFetchingCompanyInfo } = useGetCompanySetting();
  const [organizationData, setOrganizationData] = useState<CompanyInfo>();
  const storedSidebarExpanded =
    typeof window !== "undefined"
      ? localStorage.getItem("sidebar-expanded")
      : null;
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [sidebarOpen, setSidebarOpen] = useState(
    storedSidebarExpanded === null
      ? !isMobile
      : storedSidebarExpanded === "true"
  );
  const { userInfo, isFetchingUserInfo } = useAuth();

  const authKey = getCookie("authKey");
  useEffect(() => {
    if (!authKey) {
      router.push("/signin");
    }
  });

  useEffect(() => {
    if (userInfo?.organizationId) {
      getCompanyInfo(userInfo?.organizationId)
        .then((orgInfo: CompanyInfo) => setOrganizationData(orgInfo))
        .catch((error) => console.log(error));
    }
  }, [userInfo, isFetchingUserInfo]);

  return (
    <div className="bg-[#F5F6FA] flex h-screen overflow-hidden">
      {isFetchingUserInfo || !userInfo ? (
        <LoadingSpinner />
      ) : (
        <>
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            companyInfo={organizationData}
          />

          <div className="relative flex grow flex-col overflow-y-auto overflow-x-hidden">
            <Header
              sidebarOpen={sidebarOpen}
              setSidebarOpen={(val: boolean) => {
                setSidebarOpen(val);
              }}
              companyInfo={organizationData}
            />
            <main className="h-full overflow-x-hidden grow">{children}</main>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardLayout;
