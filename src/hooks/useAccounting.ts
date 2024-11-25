"use client";
import { FilterValues } from "@/components/Accountings/GHCToAuditor";
import { axiosInstance } from "@/utils/config";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

interface GetAccounting {
  filter?: FilterValues;
  sort?: string;
  pageSize: number;
  page: number;
}

export const useAccounting = ({
  filter,
  sort,
  pageSize,
  page,
}: GetAccounting) => {
  const [accountingData, setAccountingData] = useState<any>({
    isLoading: false,
    data: null,
  });

  const fetchData = async () => {
    setAccountingData({ ...accountingData, isLoading: true });
    const data: any = await axiosInstance.post(
      `/api/accounting/?sort=${sort}&pageSize=${pageSize}&page=${page}`,
      filter
    );
    data &&
      setAccountingData({
        ...accountingData,
        isLoading: false,
        data: data.data,
      });
    return data;
  };


  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    return fetchData();
  };
  return { ...accountingData, refetch };
};