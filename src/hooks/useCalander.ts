import { axiosInstance } from "@/utils/config";
import React, { useEffect } from "react";

const useCalander = (id: any) => {
  const [calander, setCalanderColumn] = React.useState({
    loading: false,
    data: [],
  });

  const fetchData = async () => {
    setCalanderColumn({ ...calander, loading: true });
    const { data }: any = await axiosInstance.get(`/api/calander?orgId=${id}`);
    const { data: auditData } = data;
  
    auditData &&
      setCalanderColumn({ ...calander, loading: false, data: auditData });
    return data;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    return fetchData();
  };

  return { ...calander, refetch };
};

export default useCalander;
