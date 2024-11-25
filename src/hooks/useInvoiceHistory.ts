import { axiosInstance } from "@/utils/config";
import { useEffect, useState } from "react";

export const useInvoiceHistory = ({ clientId, pageSize, page }: any) => {
  const [invoiceHistoryData, setInvoiceHistoryData] = useState<any>({
    isLoading: false,
    data: null,
  });

  const fetchData = async () => {
    setInvoiceHistoryData({ ...invoiceHistoryData, isLoading: true });
    const data: any = await axiosInstance.post(
      `/api/invoice/invoice-history/?pageSize=${pageSize}&page=${page}`,
      {
        id: clientId,
      }
    );
    data &&
      setInvoiceHistoryData({
        ...invoiceHistoryData,
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
  return { ...invoiceHistoryData, refetch };
};
