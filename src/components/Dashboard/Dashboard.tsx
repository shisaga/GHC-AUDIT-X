"use client";
import { useAuth } from "@/contexts/AuthProvider";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../Common/LoadingSpinner";
import Analytics from "./Analytics";
import { Heading } from "@/stories/Heading/Heading";
import Upcoming from "./Upcoming";
import useUpcomming from "@/hooks/useUpcomming";
import { SBTabs } from "@/stories/Tabs/Tabs";
import SBInput from "@/stories/Input/Input";
import SBSelect from "@/stories/Select/Select";
import { USER_ROLE, getUserRole } from "@/types/roles";
import { getAllUsers } from "@/hooks/useUser";
import { UserInfo } from "@/types/user";
import { debounce } from "lodash";
import { Button } from "@/stories/Button/Button";
import { GrPowerReset } from "react-icons/gr";
import { SBTooltip } from "@/stories/Tooltip/Tooltip";
import { useMediaQuery } from "react-responsive";
import { FaFilter } from "react-icons/fa";
import { useFormik } from "formik";
import DashboardFilterSidebar from "./DashboardFilterSidebar";
import { useRouter } from "next/navigation";

export interface DashboardFilterValues {
  startDate?: number;
  endDate?: number;
  assignee?: string;
}

const Dashboard = () => {
  const { userInfo } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState<any>({
    startDate: 0,
    endDate: 0,
    assignee: "",
  });

  const isMobile = useMediaQuery({ maxWidth: 480 });
  const isTablet = useMediaQuery({ maxWidth: 959 });
  const [openFilterSidebar, setOpenFliterSidebar] = useState<boolean>(false);

  const formik = useFormik({
    validateOnChange: true,
    initialValues: {
      startDate: 0,
      endDate: 0,
      assignee: "",
    },
    onSubmit: (values: DashboardFilterValues) => {
      setFilter(values);
      setOpenFliterSidebar(false);
    },
  });

  const {
    refetch,
    data: jsonData,
    loading,
  } = useUpcomming({
    startDate: filter.startDate || "",
    endDate: filter.endDate || "",
    assignee: filter.assignee || "",
  });

  const [selectedView, setSelectedView] = useState<string>(
    userInfo?.roles?.[0]?.name !== "Admin" ? "upcoming" : "analytics"
  );
  const [auditorList, setAuditorList] = useState<any>([]);

  useEffect(() => {
    const getAllAuditor = async () => {
      const allAuditor = await getAllUsers({
        roleId: getUserRole(USER_ROLE.AUDITOR),
        orgId: userInfo?.organizationId || "",
      });
      setAuditorList(allAuditor);
    };
    getAllAuditor();
  }, []);

  const tabButton = [
    {
      label: "Analytics",
      value: "analytics",
      hide: userInfo?.roles?.[0]?.name !== "Admin",
    },
    { label: "Upcoming", value: "upcoming" },
  ];

  useEffect(() => {
    refetch();
  }, [selectedView]);

  useEffect(() => {
    if (userInfo?.roles?.[0].name === "Contractor") {
      router.push("/audits");
    }
  }, [userInfo]);

  useEffect(() => {
    const debouncedReFetch = debounce(() => {
      if (filter.assignee) {
        refetch();
      }
      if (filter.startDate && filter.endDate) {
        refetch();
      } else if (!filter.startDate && !filter.endDate) {
        refetch();
      }
    }, 300);
    debouncedReFetch();
  }, [filter]);

  return (
    <>
      <div className="md:p-6 p-4 flex flex-col lg:gap-5 gap-4">
        {!userInfo || !jsonData || loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="flex md:justify-between justify-start md:items-center md:flex-row flex-col w-full gap-5">
              <div className="flex items-center justify-between">
                <Heading label="Dashboard" type="h2" />
                {!(
                  userInfo?.roles?.[0]?.name === "Auditor" ||
                  userInfo?.roles?.[0]?.name === "Contractor"
                ) && (
                  <div className="flex gap-4 md:hidden">
                    <Button
                      id="clear-filter-mobile"
                      icon={<GrPowerReset className="lg:text-lg text-base" />}
                      label=""
                      variant="white"
                      className="!text-black !bg-white"
                      backgroundColor=""
                      hide={
                        userInfo?.roles?.[0]?.name === "Auditor" ||
                        userInfo?.roles?.[0]?.name === "Contractor"
                      }
                      onClick={async () => {
                        await setFilter({
                          startDate: 0,
                          endDate: 0,
                          assignee: "",
                        });
                        refetch();
                        formik.resetForm();
                      }}
                    />
                    <SBTooltip
                      place="bottom"
                      message="Clear filter"
                      id="clear-filter-mobile"
                      className="max-w-full !text-xs -mt-1"
                    />

                    <Button
                      label={""}
                      size={isMobile ? "medium" : "large"}
                      icon={<FaFilter className="md:text-sm" />}
                      onClick={() => setOpenFliterSidebar(true)}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 justify-end md:flex-row flex-col-reverse">
                {!(
                  userInfo?.roles?.[0]?.name === "Auditor" ||
                  userInfo?.roles?.[0]?.name === "Contractor"
                ) && (
                  <>
                    {!isTablet && (
                      <div className="flex gap-4 md:flex-row flex-col ">
                        <div className="w-fit flex justify-center items-center">
                          <Button
                            id="clear-filter"
                            icon={<GrPowerReset className="text-lg" />}
                            label=""
                            variant="white"
                            className="!text-black !bg-white"
                            backgroundColor=""
                            hide={
                              userInfo?.roles?.[0]?.name === "Auditor" ||
                              userInfo?.roles?.[0]?.name === "Contractor"
                            }
                            onClick={async () => {
                              await setFilter({
                                startDate: 0,
                                endDate: 0,
                                assignee: "",
                              });
                              refetch();
                              formik.resetForm();
                            }}
                          />
                          <SBTooltip
                            place="bottom"
                            message="Clear filter"
                            id="clear-filter"
                            className="max-w-full !text-xs -mt-1"
                          />
                        </div>
                        <div className="flex max-w-fit">
                          <SBSelect
                            id={`auditor`}
                            label={""}
                            value={filter.assignee}
                            options={auditorList?.map((element: UserInfo) => {
                              return {
                                value: element.id,
                                label: `${element.firstName} ${element.lastName}`,
                              };
                            })}
                            onChange={(data) =>
                              setFilter({ ...filter, assignee: data })
                            }
                          />
                        </div>

                        <div className="flex max-w-[160px]">
                          <SBInput
                            id="startTime"
                            name="startTime"
                            label="Start Date"
                            inputType="date"
                            value={filter.startDate}
                            onChange={(e) =>
                              setFilter({
                                ...filter,
                                startDate: e.target.value,
                              })
                              
                            }
                          />
                        </div>

                        <div className="flex max-w-[160px]">
                          <SBInput
                            id="endTime"
                            name="endTime"
                            label="End Date"
                            inputType="date"
                            showTimeSelect={false}
                            minDate={filter.startDate}
                            showTimeSelectOnly={false}
                            value={filter.endDate}
                            onChange={(e) =>
                              setFilter({ ...filter, endDate: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    )}
                    <div className="hidden md:block lg:hidden">
                      <div className="flex gap-4">
                        <Button
                          id="clear-filter-mobile"
                          icon={<GrPowerReset className="text-lg" />}
                          label=""
                          variant="white"
                          className="!text-black !bg-white"
                          backgroundColor=""
                          hide={
                            userInfo?.roles?.[0]?.name === "Auditor" ||
                            userInfo?.roles?.[0]?.name === "Contractor"
                          }
                          onClick={async () => {
                            await setFilter({
                              startDate: 0,
                              endDate: 0,
                              assignee: "",
                            });
                            refetch();
                            formik.resetForm();
                          }}
                        />
                        <SBTooltip
                          place="bottom"
                          message="Clear filter"
                          id="clear-filter-mobile"
                          className="max-w-full !text-xs -mt-1"
                        />

                        <Button
                          label={""}
                          icon={<FaFilter className="md:text-sm" />}
                          onClick={() => setOpenFliterSidebar(true)}
                        />
                      </div>
                    </div>
                    <SBTabs
                      activeTab={selectedView}
                      className="min-w-[150px] flex items-center justify-center"
                      tabCallback={(value: any) => {
                        setSelectedView(value);
                      }}
                      tabList={[...tabButton]}
                      tabBody={null}
                    />
                  </>
                )}
              </div>
            </div>
            <div>
              {selectedView === "analytics" ? (
                <Analytics
                  refetch={() => refetch()}
                  data={jsonData}
                  loading={loading}
                />
              ) : (
                <Upcoming
                  refetch={() => refetch()}
                  data={jsonData}
                  loading={loading}
                />
              )}
            </div>
          </>
        )}
      </div>
      <DashboardFilterSidebar
        formik={formik}
        open={openFilterSidebar}
        close={() => {
          setOpenFliterSidebar(false);
        }}
        id="Dashboard"
      />
    </>
  );
};

export default Dashboard;
