import { axiosInstance } from "@/utils/config";
import { useMutation, useQuery, useQueryClient } from "react-query";

// Function to fetch documents

const createDocument = async ({
  clientId,
  document,
}: {
  clientId: any;
  document: [];
}): Promise<any> => {
  const { data } = await axiosInstance.post(
    `/api/document/create/${clientId}`,
    document
  );
  return data;
};

export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(createDocument, {
    onSuccess: () => {
      queryClient.invalidateQueries("create-document");
    },
  });

  return { isCreating: isLoading, createDocument: mutateAsync };
};

const uploadDocument = async (files: any): Promise<any> => {
  const { data } = await axiosInstance.post(`/api/document/upload/`, files, {
    headers: {
      "content-type": "multipart/form-data",
    },
  });
  return data;
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(uploadDocument, {
    onSuccess: () => {
      queryClient.invalidateQueries("upload-document");
    },
  });

  return { isUploading: isLoading, uploadDocument: mutateAsync };
};

export const useAllReports = (clientId: string) => {
  const { isLoading, data, refetch } = useQuery(["all-reports"], async () => {
    const { data } = await axiosInstance.get(`/api/document/${clientId}`);
    return data;
  });
  return { isLoading, data, refetch };
};

const deleteDocumentByKey = async (fileName: string): Promise<string[]> => {
  const { data } = await axiosInstance.delete(`/api/document/${fileName}`);
  return data;
};

export const useDeleteDocumentByKey = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(deleteDocumentByKey, {
    onSuccess: () => {
      queryClient.invalidateQueries("all-reports");
    },
  });

  return { isDeletingByKey: isLoading, deleteDocumentByKey: mutateAsync };
};

const deleteDocumentById = async (id: string): Promise<string[]> => {
  const { data } = await axiosInstance.delete(`/api/document/${id}`);
  return data;
};

export const useDeleteDocumentById = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(deleteDocumentById, {
    onSuccess: () => {
      queryClient.invalidateQueries("all-reports");
    },
  });

  return { isDeletingById: isLoading, deleteDocumentById: mutateAsync };
};
