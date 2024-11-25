import { axiosInstance } from "@/utils/config";
import { useState } from "react";

const useNotification = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const getSpecificNotification = async () => {
    setLoading(true);
    const { data }: any = await axiosInstance.get(`/api/notification/`);
    setData(data);
    setLoading(false);
    return data;
  };
  const refetch = () => {
    getSpecificNotification();
  };

  return {
    data: data?.data,
    notReaded: data?.notReaded,
    loading,
    refetch,
  };
};

export default useNotification;

export const notificationRead = async (id: number) => {
  const { data }: any = await axiosInstance.post(`/api/notification/`, { id });
  return data;
};
