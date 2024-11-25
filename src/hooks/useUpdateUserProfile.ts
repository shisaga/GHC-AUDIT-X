import { UserInfo } from "@/types/user";
import { axiosInstance } from "@/utils/config";
import { getCookie } from "cookies-next";
import { useMutation, useQueryClient } from "react-query";

export const updateUserProfile = async (
  user: Partial<UserInfo>
): Promise<UserInfo> => {
  const { data } = await axiosInstance.put(`/api/user/`, user, {
    headers: {
      "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
    },
  });
  return data;
};

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updateUserProfile, {
    onSuccess: (user: Partial<UserInfo>) => {
      queryClient.invalidateQueries("user-info-update");
    },
  });

  return { isProfileUpdating: isLoading, updateUserProfile: mutateAsync };
}
