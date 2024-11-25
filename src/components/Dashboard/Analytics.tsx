"use client";
import BarChart from "./Chart/BarChart";
import DoughnutChart from "./Chart/DoughnutChart";
import PieChart from "./Chart/PieChart";
import { useEffect, useState } from "react";
import { Card } from "@/stories/Card/Card";
import { Heading } from "@/stories/Heading/Heading";
import {
  AUDIT_STATUS,
  STATUS_BG_COLOR,
  STATUS_TEXT_COLOR,
} from "@/utils/constant";
import { Label } from "@/stories/Label/Label";
import { useMediaQuery } from "react-responsive";

const Analytics = ({ refetch, data: jsonData, loading }: any) => {
  const [chartTimeFilter, setChartTimeFilter] = useState("");
  const [chartTimeFilter1, setChartTimeFilter1] = useState("");
  const [chartTimeFilter2, setChartTimeFilter2] = useState("");
  const [analyticsData, setAnalyticsData] = useState<any>({
    auditorDataList: [],
  });
  const [analyticsChartData, setAnalyticsChartData] = useState<any>({
    chart1: [],
    chart2: [],
    chart3: [],
  });
  const isTablet = useMediaQuery({ maxWidth: 980 });

  useEffect(() => {
    if (jsonData) {
      setAnalyticsData(jsonData?.data?.analyticsData);
    }
  }, [jsonData]);
  const toDate = (timestamp: any) => new Date(timestamp);

  // Function to group data by month, quarter, year, and day
  const groupData = (data: any) => {
    const groupedData = {
      monthlyData: new Map(),
      quarterlyData: new Map(),
      yearlyData: new Map(),
      dailyData: new Map(),
    };

    data.forEach((entry: any) => {
      const date = toDate(entry.auditDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // Adjust month to be 1-indexed
      const quarter = Math.floor((month - 1) / 3) + 1; // Calculate quarter
      const day = date.getDate();

      // Group by month
      const monthlyKey = `${year}-${month}`;
      groupedData.monthlyData.set(monthlyKey, {
        totalAudits:
          (groupedData.monthlyData.get(monthlyKey)?.totalAudits || 0) +
          entry.totalAudits,
        totalAuditCost:
          (groupedData.monthlyData.get(monthlyKey)?.totalAuditCost || 0) +
          entry.totalAuditCost,
      });

      // Group by quarter
      const quarterlyKey = `${year}-Q${quarter}`;
      groupedData.quarterlyData.set(quarterlyKey, {
        totalAudits:
          (groupedData.quarterlyData.get(quarterlyKey)?.totalAudits || 0) +
          entry.totalAudits,
        totalAuditCost:
          (groupedData.quarterlyData.get(quarterlyKey)?.totalAuditCost || 0) +
          entry.totalAuditCost,
      });

      // Group by year
      groupedData.yearlyData.set(year, {
        totalAudits:
          (groupedData.yearlyData.get(year)?.totalAudits || 0) +
          entry.totalAudits,
        totalAuditCost:
          (groupedData.yearlyData.get(year)?.totalAuditCost || 0) +
          entry.totalAuditCost,
      });

      // Group by day
      const dailyKey = `${month}-${day}-${year}`;
      groupedData.dailyData.set(dailyKey, {
        totalAudits:
          (groupedData.dailyData.get(dailyKey)?.totalAudits || 0) +
          entry.totalAudits,
        totalAuditCost:
          (groupedData.dailyData.get(dailyKey)?.totalAuditCost || 0) +
          entry.totalAuditCost,
      });
    });

    // Convert Map objects to array of objects
    const monthlyArray = Array.from(
      groupedData.monthlyData,
      ([label, { totalAudits, totalAuditCost }]) => ({
        label,
        totalAudits,
        totalAuditCost,
      })
    );
    const quarterlyArray = Array.from(
      groupedData.quarterlyData,
      ([label, { totalAudits, totalAuditCost }]) => ({
        label,
        totalAudits,
        totalAuditCost,
      })
    );
    const yearlyArray = Array.from(
      groupedData.yearlyData,
      ([label, { totalAudits, totalAuditCost }]) => ({
        label,
        totalAudits,
        totalAuditCost,
      })
    );
    const dailyArray = Array.from(
      groupedData.dailyData,
      ([label, { totalAudits, totalAuditCost }]) => ({
        label,
        totalAudits,
        totalAuditCost,
      })
    );

    return { monthlyArray, quarterlyArray, yearlyArray, dailyArray };
  };

  // Example filter function (filtering audits within a specific year)
  const filterByYear = (entry: any) => {
    const date = toDate(entry.auditDate);
    return date.getFullYear() === 2024; // Change to the desired year
  };
  useEffect(() => {
    if (!analyticsData?.auditBarChart) return;
    const groupedData: any = groupData(analyticsData.auditBarChart);

    setAnalyticsChartData({
      chart1: groupedData[chartTimeFilter || "dailyArray"],
      chart2: groupedData[chartTimeFilter1 || "dailyArray"],
      chart3: groupedData[chartTimeFilter2 || "dailyArray"],
    });
  }, [analyticsData, chartTimeFilter, chartTimeFilter1, chartTimeFilter2]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 gap-4">
        <BarChart
          filter={chartTimeFilter}
          setFilter={setChartTimeFilter}
          for={"Total-Audits"}
          data={analyticsChartData.chart1}
        />
        {isTablet ? (
          <>
            <BarChart
              filter={chartTimeFilter1}
              setFilter={setChartTimeFilter1}
              for={"Total-Cost"}
              data={analyticsChartData.chart2}
            />
            <DoughnutChart data={analyticsData} className="order-2" />
            <PieChart data={analyticsData} />
          </>
        ) : (
          <>
            <DoughnutChart data={analyticsData} className="order-2" />
            <BarChart
              filter={chartTimeFilter2}
              setFilter={setChartTimeFilter2}
              for={"Total-Cost"}
              data={analyticsChartData.chart3}
            />
            <PieChart data={analyticsData} />
          </>
        )}
      </div>
      <Card className="p-4 w-full space-y-4 mt-4">
        <Heading label="Auditors" type={"h4"}></Heading>
        {analyticsData?.auditorDataList.length ? (
          <div className="w-full overflow-x-auto">
            <div className="overflow-auto">
              <table className="w-full">
                <thead className="bg-colorLightest text-colorBlack text-left">
                  <tr>
                    <th className="py-2 px-3 first:px-5 last:px-5 whitespace-nowrap">
                      <Label label="Name" className="flex-[0.3]" />
                    </th>
                    <th className="py-2 px-3 first:px-5 last:px-5 whitespace-nowrap">
                      <Label label="Total" className="flex-[0.2]" />
                    </th>
                    <th className="py-2 px-3 first:px-5 last:px-5 whitespace-nowrap">
                      <Label label="Status" className="flex-[0.5]" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData?.auditorDataList?.map(
                    (auditorData: any, index: number) => (
                      <tr
                        className="hover:bg-colorLightest border-b border-colorLighter"
                        key={index}
                      >
                        <td className="py-2 px-3 first:px-5 last:px-5 ">
                          {auditorData?.name}
                        </td>
                        <td className="py-2 px-3 first:px-5 last:px-5 ">
                          {auditorData?.total}
                        </td>
                        <td className="py-2 px-3 first:px-5 last:px-5 ">
                          <div className="flex items-center justify-start gap-4 flex-row">
                            {Object.keys(auditorData)
                              .filter(
                                (data) =>
                                  !["imgUrl", "name", "total"].includes(data)
                              )
                              .sort((a, b) => {
                                const indexA = AUDIT_STATUS.indexOf(a);
                                const indexB = AUDIT_STATUS.indexOf(b);
                                return indexA - indexB;
                              })
                              .map((data, index) => (
                                <div
                                  key={index}
                                  style={{
                                    background: STATUS_BG_COLOR[data],
                                    color: STATUS_TEXT_COLOR[data],
                                  }}
                                  className="rounded flex text-sm font-medium justify-center items-center gap-2 p-1"
                                >
                                  {data}
                                  <span className="w-[25px] h-[22px] flex justify-center items-center text-sm rounded text-colorBlack bg-white">
                                    {auditorData[data]}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-3">
            <Heading
              color="var(--color-neutral-700)"
              label="Auditors do not have any scheduled audits at the moment."
              type="h6"
            />
          </div>
        )}
      </Card>
    </>
  );
};

export default Analytics;
