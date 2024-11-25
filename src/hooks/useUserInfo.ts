import { UserInfo } from "@/types/user";
import { axiosInstance } from "@/utils/config";
import { useQuery } from "react-query";

const fetchUserInfo = async (key?: string): Promise<UserInfo> => {
  const { data } = await axiosInstance.get(`/api/user/`);
  return data;
};

export function useUserInfo(key?: any) {
  return useQuery(
    ["user-info"],
    async () => await fetchUserInfo(key as string),
    {
      enabled: !!key,
      keepPreviousData: true,
    }
  );
}
