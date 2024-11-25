import { CompanyInfo } from "@/types/company";
import { axiosInstance } from "@/utils/config";
import { useMutation, useQueryClient } from "react-query";

const updateRegisterdCompanySetting = async (
  companyInfo: Partial<CompanyInfo>
): Promise<CompanyInfo> => {
  const { data } = await axiosInstance.put(`/api/org`, companyInfo, {
    headers: {
      "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
    },
  });
  return data;
};

const getRegisteredCompanySetting = async (id?: string) => {
  const { data } = await axiosInstance.get(`/api/org?id=${id}`);
  return data;
};

export function useUpdateCompanySetting() {
  const queryClient = useQueryClient();
  const { isLoading, mutateAsync } = useMutation(
    updateRegisterdCompanySetting,
    {
      onSuccess: () => {
        // Invalidate the query for fetching company info after successfully updating
        return queryClient.invalidateQueries("companyInfo");
      },
    }
  );
  return {
    isUpdatingCompanySetting: isLoading,
    updateCompanySetting: mutateAsync,
  };
}

export function useGetCompanySetting() {
  const { isLoading, mutateAsync, data } = useMutation(
    getRegisteredCompanySetting
  );
  return {
    data,
    isFetchingCompanyInfo: isLoading,
    getCompanyInfo: mutateAsync,
  };
}
