import { AdminManagerInfo } from "@/types/user";
import { axiosInstance } from "@/utils/config";
import { useMutation, useQuery, useQueryClient } from "react-query";

export interface GetAllUserDataResponse {
  totalPages: number;
  data: AdminManagerInfo[];
  totalItem: number;
}

const getUsers = async (
  page: number,
  limit: number,
  searchString: string,
  sortType: string,
  role: string,
  orgId:  number
): Promise<GetAllUserDataResponse> => {
  const { data } = await axiosInstance.post(
    `/api/user/search?page=${page}&limit=${limit}&sortType=${sortType}&role=${role}&orgId=${orgId}`,
    { searchTerm: searchString }
  );
  return data;
};

export const useUsers = (
  page: number,
  limit: number,
  searchString: string,
  sortType: string,
  role: string,
  orgId:  number
) => {
  return useQuery(
    ["users"],
    async () => await getUsers(page, limit, searchString, sortType, role ,orgId),
    { keepPreviousData: true }
  );
};

export const getAllUsers = async ({
  roleId,
  orgId,
}: {
  roleId: any;
  orgId: string;
}) => {
  const { data } = await axiosInstance.get(
    `/api/user/all?roleId=${roleId}&orgId=${orgId}`
  );
  return data;
};

export const getSpecificUser = async (
  id: string
): Promise<AdminManagerInfo> => {
  const { data } = await axiosInstance.get(`/api/user/${id}`);
  return data;
};

// add user
const addUser = async (user: AdminManagerInfo): Promise<AdminManagerInfo> => {
  const { data } = await axiosInstance.post("/api/user/", user);
  return data;
};

export const useAddUser = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
    },
  });

  return { isAdding: isLoading, addUser: mutateAsync };
};

// Update user
const updateUser = async (
  user: AdminManagerInfo
): Promise<AdminManagerInfo> => {
  const { data } = await axiosInstance.put("/api/user/", user);
  return data;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
    },
  });

  return { isUpdating: isLoading, updateUser: mutateAsync };
};

// Delete client
const deleteUsers = async (id: string): Promise<string[]> => {
  const { data } = await axiosInstance.delete(`/api/user/${id}`);
  return data;
};

export const useDeleteUsers = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(deleteUsers, {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
    },
  });

  return { isDeleting: isLoading, deleteUsers: mutateAsync };
};

export const checkUniqEA = async (id: string) => {
  const { data }: any = await axiosInstance.post(`/api/user/EA`, {
    EA: id,
  });
  return data;
};
