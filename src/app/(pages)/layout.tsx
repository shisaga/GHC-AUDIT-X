"use client";
import DashboardLayout from "@/partials/DashboardLayout";
import "../../styles/dashboard.scss";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import LoadingSpinner from "@/components/Common/LoadingSpinner";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userInfo, isFetchingUserInfo } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const allowedRoute: any = {
    Admin: [
      "/dashboard",
      "/calendar",
      "/audits",
      "/admins",
      "/managers",
      "/auditors",
      "/contractors",
      "/service-organization",
      "/accounting",
      "/settings",
      "/profile"
    ],
    Manager: [
      "/dashboard",
      "/calendar",
      "/audits",
      "/managers",
      "/auditors",
      "/contractors",
      "/accounting",
      "/profile"
    ],
    Auditor: ["/dashboard",  "/calendar", "/audits", "/accounting" , "/profile"],
    Contractor: ["/audits", "/accounting", "/profile"],
  };

  useEffect(() => {
    if (userInfo?.roles?.[0]?.name) {
      setIsLoading(false);
      const allowedPaths = allowedRoute[userInfo?.roles?.[0]?.name];
      // Check if the current pathname starts with any allowed path
      const isAllowedPath = allowedPaths.some((allowedPath: any) =>
        pathname.startsWith(allowedPath)
      );
      if ((!isAllowedPath && !userInfo?.roles?.[0]?.name) || !isAllowedPath) {
        router.push("/signin");
      }
    } else if (!userInfo?.roles?.[0]?.name) {
      setIsLoading(isFetchingUserInfo);
    }
  }, [pathname, userInfo]);

  if (isFetchingUserInfo) return <LoadingSpinner />;
  return <DashboardLayout>{children}</DashboardLayout>;
}
