import { AuditFormData } from "@/types/user";
import { axiosInstance } from "@/utils/config";
import { useMutation, useQuery, useQueryClient } from "react-query";

export interface GetAllAuditDataResponse {
  success: boolean;
  message: string;
  totalPages: number;
  totalItem: number;
  data: AuditFormData[];
}

const getAudits = async (
  orgId: string,
  filter: any,
  sortType: any,
  page: number,
  limit: number
): Promise<GetAllAuditDataResponse> => {
  const { data } = await axiosInstance.post(
    `/api/audit/${orgId}?sort=${sortType}&page=${page}&limit=${limit}`,
    { ...filter }
  );
  return data;
};

export const useAudits = (
  orgId: string,
  filter: any,
  sortType: any,
  page: number,
  limit: number
) => {
  return useQuery(
    ["audits"],
    async () => await getAudits(orgId, filter, sortType, page, limit),
    { keepPreviousData: true }
  );
};

export const getSpecificAudit = async (id: string): Promise<AuditFormData> => {
  const { data } = await axiosInstance.get(`/api/audit/client/${id}`);
  return data;
};

// add user
const addAudit = async (auditData: AuditFormData): Promise<AuditFormData> => {
  const { data } = await axiosInstance.post("/api/audit/", auditData);
  return data;
};

const changeHistory = async (id: string): Promise<AuditFormData[]> => {
  const { data } = await axiosInstance.get(`/api/change-history/${id}`);
  return data;
};

export const useChangeHistory = (id: string) => {
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  return useQuery(["change-history"], () => changeHistory(id), {
    keepPreviousData: true,
  });
};

export const useAddAudit = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addAudit, {
    onSuccess: () => {
      queryClient.invalidateQueries("audits");
    },
  });

  return { isAdding: isLoading, addAudit: mutateAsync };
};

// Update user
const updateAudit = async (
  auditData: AuditFormData
): Promise<AuditFormData> => {
  const { data } = await axiosInstance.put(
    `/api/audit/client/${auditData.id}`,
    auditData
  );
  return data;
};

export const useUpdateAudit = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync  } = useMutation(updateAudit, {
    onSuccess: () => {
      queryClient.invalidateQueries("audits");
    },
  });

  return { isUpdating: isLoading, updateAudit: mutateAsync  };
};

// Delete client
const deleteAudit = async (id: string): Promise<string> => {
  const { data } = await axiosInstance.delete(`/api/audit/${id}`);
  return data;
};

export const useDeleteAudit = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(deleteAudit, {
    onSuccess: () => {
      queryClient.invalidateQueries("audits");
    },
  });

  return { isDeleting: isLoading, deleteAudit: mutateAsync };
};

export const checkUniqEA = async (EA: string) => {
  const { data }: any = await axiosInstance.post(`/api/audit/EA`, {
    EA,
  });
  return data;
};

export const convertAuditType = async (
  id: string,
  audit: any
): Promise<string[]> => {

  const { data } = await axiosInstance.post(`/api/audit/client/${id}`, {
    audit,
  });
  return data;
};

const createNotes = async ({
  clientId,
  notes,
}: {
  clientId: any;
  notes: {
    note: string;
    files: [];
  };
}): Promise<any> => {
  const { data } = await axiosInstance.put(
    `/api/audit/create/notes/${clientId}`,
    notes
  );
  return data;
};

export const useCreateNotes = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(createNotes, {
    onSuccess: () => {
      queryClient.invalidateQueries("create-notes");
    },
  });

  return { isCreating: isLoading, createNotes: mutateAsync };
};

const deleteNotesFile = async ({
  id,
  fileName,
}: {
  id: string;
  fileName: string;
}) => {
  const { data } = await axiosInstance.delete(
    `/api/audit/delete/notes/file/${id}?fileName=${fileName}`
  );
  return data;
};

export const useDeleteNoteFile = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(deleteNotesFile, {
    onSuccess: () => {
      queryClient.invalidateQueries("create-notes");
    },
  });

  return { isDeleting: isLoading, deleteNotesFile: mutateAsync };
};

const updateBulkStatus = async ({
  ids,
  type,
}: {
  ids: string[];
  type: string;
}) => {
  const { data } = await axiosInstance.put(`/api/audit/payment-status`, {
    ids,
    type,
  });
  return data;
};

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updateBulkStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries("update-bulk-payment");
    },
  });

  return { isUpdating: isLoading, updateBulkStatus: mutateAsync };
};

const markAsPaid = async ({
  auditIds,
  auditData,
}: {
  auditIds: string[];
  auditData: {
    paid: boolean;
    paymentType: string;
    paymentDate: number;
  };
}) => {
  const { data } = await axiosInstance.put(`/api/audit/mark-as-paid`, {
    auditIds,
    auditData,
  });
  return data;
};

export const useMarkAsPaid = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(markAsPaid, {
    onSuccess: () => {
      queryClient.invalidateQueries("manual-mark-paid");
    },
  });

  return { isUpdating: isLoading, markAsPaid: mutateAsync };
};

export const getAllAuditData = async (
  orgId: string,
  filter: any,
  sortType: any,
  page: number,
  limit: number
) => {
  const { data } = await axiosInstance.post(
    `/api/audit/${orgId}?sort=${sortType}&page=${page}&limit=${limit}`,
    { ...filter }
  );
  return data;
};
