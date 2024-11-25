import { axiosInstance } from "@/utils/config";
import { useMutation } from "react-query";

const resetNewPassword = async ({
  code,
  newPassword,
}: {
  code: string;
  newPassword: string;
}) => {
  const { data } = await axiosInstance.post("/api/user/set-password", {
    token: code,
    password: newPassword,
  });
  return data;
};

export function useResetNewPassword() {
  const { isLoading, mutateAsync } = useMutation(resetNewPassword);

  return { isResetting: isLoading, resetNewPassword: mutateAsync };
}
