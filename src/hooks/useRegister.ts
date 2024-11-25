import { UserInfo } from "@/types/user";
import { axiosInstance } from "@/utils/config";
import { useMutation } from "react-query";

const register = async (orgInfo: UserInfo): Promise<UserInfo> => {
  const { data } = await axiosInstance.post(`/api/org`, orgInfo);
  return data;
};

export function useRegister() {
  const { isLoading, mutateAsync } = useMutation(register);
  return { isRegistering: isLoading, register: mutateAsync };
}

export const sendVerificationLink = async (email: string) => {
  return await axiosInstance.post("/api/user/reset-password", {
    email,
  });
};
