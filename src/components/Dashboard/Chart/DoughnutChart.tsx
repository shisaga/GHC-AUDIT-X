"use client";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card } from "@/stories/Card/Card";
import { Heading } from "@/stories/Heading/Heading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DoughnutChart = ({ data }: any) => {
  return (
    <Card className="py-3 px-5 flex flex-col justify-between gap-4">
      <div className="flex justify-between items-center gap-3">
        <Heading label="Audits" type="h5" />
      </div>
      <div className="w-full h-[25vh]">
        {data?.assigneePieChart?.assigned > 0 ||
        data?.assigneePieChart?.unassigned > 0 ? (
          <Doughnut
            data={{
              labels: Object.keys(data?.assigneePieChart || {}),
              datasets: [
                {
                  label: "count",
                  data: Object.values(data?.assigneePieChart || {}),
                  backgroundColor: [
                    "rgba(60, 80, 224,1)",
                    "rgba(101,119,241,1)",
                    "rgba(15,173,207,1)",
                    "rgba(143,208,239,1)",
                  ],
                  borderWidth: 1,
                  borderColor: "#ffffff",
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
              label={"No audit assigne data found"}
              type="h6"
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default DoughnutChart;
