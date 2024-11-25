"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card } from "@/stories/Card/Card";
import { Heading } from "@/stories/Heading/Heading";
import MoreActionButtons from "@/components/Common/MoreMenuWithEditDeleteIcons";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = (data: any) => {
  const lable: any = {
    dailyArray: "Date View",
    monthlyArray: "Month View",
    quarterlyArray: "Quarter View",
    yearlyArray: "Year view",
  };
  return (
    <>
      <Card className="py-3 px-5 md:col-span-2 h-full justify-between gap-4">
        <div></div>
        <div className="flex justify-between items-center gap-3">
          <Heading label={`${data?.for?.split("-")[1]}`} type="h5" />
          {data?.data?.length > 0 && (
            <MoreActionButtons
              placement="bottom-end"
              actionElementClass="!w-full !bg-colorLightest rounded-normal px-2"
              actionElement={
                <div className="flex gap-1">
                  {lable[data.filter || "dailyArray"]}{" "}
                  <PiDotsThreeOutlineVerticalFill
                    color="var(--color-primary)"
                    className="text-lg"
                  />
                </div>
              }
              items={[
                {
                  iconBackground: "var(--color-neutral-100)",
                  icon: "",
                  label: "Date View",
                  clickAction: () => data?.setFilter("dailyArray"),
                },
                {
                  iconBackground: "var(--color-neutral-100)",
                  icon: "",
                  label: "Month View",
                  clickAction: () => data.setFilter("monthlyArray"),
                },
                {
                  iconBackground: "var(--color-neutral-100)",
                  icon: "",
                  label: "Quarter view",
                  clickAction: () => data.setFilter("quarterlyArray"),
                },
                {
                  iconBackground: "var(--color-neutral-100)",
                  icon: "",
                  label: "Year view",
                  clickAction: () => data.setFilter("yearlyArray"),
                },
              ]}
              editView={true}
              // actionElementClass="!bg-colorLighter rounded-normal"
            />
          )}
        </div>

        <div className="w-full relative h-[25vh]">
          {data?.data?.length > 0 ? (
            <Bar
              data={{
                labels: data?.data?.map((data: any) => data.label),
                datasets: [
                  (() =>
                    data.for !== "Total-Cost"
                      ? {
                          label: "Total Audits",
                          data: data?.data?.map(
                            (data: any) => data.totalAudits
                          ),
                          borderColor: `#000000`,
                          backgroundColor: "#406AE8",
                          barThickness: 25,
                        }
                      : {
                          label: "Total Audits Cost",
                          data: data?.data?.map(
                            (data: any) => data.totalAuditCost
                          ),
                          borderColor: `#000000`,
                          backgroundColor: "#12A8B7",
                          barThickness: 25,
                        })(),
                ],
              }}
              options={{
                scales: {
                  x: {
                    display: true, // show/ hide x-axis
                    grid: {
                      display: true, // show/hide grid line in x-axis
                    },
                  },
                  y: {
                    display: true, // same as x-axis
                    grid: {
                      display: true,
                    },
                  },
                },
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
                maintainAspectRatio: false,
                responsive: true,
              }}
            />
          ) : (
            <div className="flex items-center h-[25vh] justify-center py-3">
              <Heading
                color="var(--color-neutral-700)"
                label={
                  data?.for?.split("-")[1] === "Audits"
                    ? "No audit data found"
                    : "No cost data found"
                }
                type="h6"
              />
            </div>
          )}
        </div>
      </Card>
    </>
  );
};

export default BarChart;
