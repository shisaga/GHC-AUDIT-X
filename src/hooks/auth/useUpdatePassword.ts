import { axiosInstance } from "@/utils/config";
import { useMutation } from "react-query";

const updatePassword = async ({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}) => {
  const { data } = await axiosInstance.post("/api/user/change-password", {
    oldPassword,
    newPassword,
  });
  return data;
};

export function useUpdatePassword() {
  const { isLoading, mutateAsync } = useMutation(updatePassword);
  return { isUpdating: isLoading, updatePassword: mutateAsync };
}
