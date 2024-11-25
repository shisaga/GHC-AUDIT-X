import { axiosInstance } from "@/utils/config";
import { useMutation } from "react-query";

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<string> => {
  const { data } = await axiosInstance.post(`/api/user/login`, {
    email,
    password,
  });
  return data;
};
export function useLogin() {
  const { isLoading, mutateAsync } = useMutation(login);
  return { isLoggingIn: isLoading, login: mutateAsync };
}
