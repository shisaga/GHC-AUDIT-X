"use client";
import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  PieController,
  ArcElement,
  Legend,
  Title,
  Tooltip,
} from "chart.js";
import { Card } from "@/stories/Card/Card";
import { Heading } from "@/stories/Heading/Heading";
import { STATUS_BG_COLOR } from "@/utils/constant";

ChartJS.register(PieController, ArcElement, Title, Legend, Tooltip);

const PieChart = (data: any) => {
  return (
    <Card className="py-3 px-5 flex flex-col h-full justify-between gap-4">
      <div className="flex justify-between items-center gap-3">
        <Heading label="Overall Status" type="h5" />
      </div>
      <div className="w-full md:col-span-2 h-[25vh]">
        {Object.keys(data?.data?.statusPieChart || {}).length > 0 ? (
          <Pie
            data={{
              labels: Object?.keys(data?.data?.statusPieChart || {}),
              datasets: [
                {
                  label: "total",
                  data: Object?.values(data?.data?.statusPieChart || {}),
                  backgroundColor: Object?.keys(
                    data?.data?.statusPieChart || {}
                  ).map((data) => STATUS_BG_COLOR[data]),
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  position: "bottom",
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
              label={"No audit status found"}
              type="h6"
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default PieChart;
