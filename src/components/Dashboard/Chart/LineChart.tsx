"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Heading } from "@/stories/Heading/Heading";
import { Card } from "@/stories/Card/Card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = (data: any) => {
  return (
    <Card className="py-3 px-5 md:col-span-2 h-full justify-between gap-4">
      <div className="flex justify-between items-center gap-3">
        <Heading label="Line Chart" type="h5" />
      </div>
      <div className="w-full relative h-[50vh]">
        <Line
          data={{
            labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            datasets: [
              {
                label: "Product One",
                data: [18726, 22201, 19490, 17945, 24182, 17842, 22475],
                borderColor: "rgb(255, 99, 132)",
              },
              {
                label: "Product Two",
                data: [12726, 16201, 20490, 14945, 21182, 29842, 24475],
                borderColor: "rgb(53, 162, 235)",
              },
            ],
          }}
          options={{
            plugins: {
              legend: {
                position: "top",
              },
            },
            maintainAspectRatio: false,
            responsive: true,
          }}
        />
      </div>
    </Card>
  );
};

export default LineChart;
