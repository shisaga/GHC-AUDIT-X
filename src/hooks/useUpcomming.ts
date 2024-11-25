"use client";
import { axiosInstance } from "@/utils/config";
import React from "react";
import moment from "moment";

const useUpcomming = (data: any) => {
  let { startDate, endDate, assignee } = data;
  const [upcommingColumn, setUpcomingColumn] = React.useState({
    loading: false,
    data: {},
  });
  if (startDate && endDate) {
    startDate = moment.utc(startDate).valueOf();
    endDate = moment.utc(endDate).valueOf();
  }
  const fetchData = async () => {
    setUpcomingColumn({ ...upcommingColumn, loading: true });
    const { data }: any = await axiosInstance.get(
      `/api/audit/upcoming-audit?startDate=${startDate}&endDate=${endDate}&assignee=${assignee || ""}`
    );
    data && setUpcomingColumn({ ...upcommingColumn, loading: false, data });

    return data;
  };
  const refetch = () => {
    return fetchData();
  };

  return { ...upcommingColumn, refetch };
};

export default useUpcomming;
