import { axiosInstance } from "@/utils/config";

export const generateInvoice = async (auditData: any): Promise<any> => {
  const { data } = await axiosInstance.post(
    `/api/invoice/${auditData.data.clientId}`,
    {
      dAuditId: auditData?.formData?.generateInvoce == "D" || auditData?.formData?.generateInvoce == "Both"? auditData?.data?.dAuditId || null :null,
      eAuditId: auditData?.formData?.generateInvoce == "E" || auditData?.formData?.generateInvoce == "Both" ? auditData?.data?.eAuditId || null :null ,
      orgId: auditData.orgId,
      ...auditData,
    }
  );
  return data;
};

export const downloadInvoice = async (
  clientId: string,
  audit: any
): Promise<any> => {
  const { data } = await axiosInstance.post(
    `/api/invoice/invoice-download/${clientId}`,
    {
      dAuditId: audit?.formData?.generateInvoce == "D" || audit?.formData?.generateInvoce == "Both"? audit?.data?.dAuditId || null :null,
      eAuditId: audit?.formData?.generateInvoce == "E" || audit?.formData?.generateInvoce == "Both" ? audit?.data?.eAuditId || null :null ,
      orgId: audit.orgId,
    }
  );
  return data;
};

export const generateInvoicePaymentSection = async (
  audit: any,
  type: any
): Promise<any> => {
  const { data } = await axiosInstance.post(`/api/invoice/invoice-payment`, {
    dAuditId: audit?.data?.auditId || null,
    eAuditId: null,
    orgId: audit.orgId,
    type: type,
  });
  return data;
};

export const getInvoice = async (data: any): Promise<any> => {
  const { data: res } = await axiosInstance.post(
    `/api/invoice/get-invoice`,
    data
  );
  return res;
};

export const generateBulkInvoice = async (data: any, type: string) => {
  return await axiosInstance.post(`/api/invoice/batch`, { ...data, type });
};

export const generateCombineInvoice = async (auditData: any): Promise<any> => {
  const { data } = await axiosInstance.post(
    `/api/invoice/combine/${auditData.data.clientId}`,
    {
      dAuditId: auditData?.formData?.generateInvoce == "D" || auditData?.formData?.generateInvoce == "Both"? auditData?.data?.dAuditId || null :null,
      eAuditId: auditData?.formData?.generateInvoce == "E" || auditData?.formData?.generateInvoce == "Both" ? auditData?.data?.eAuditId || null :null ,
      orgId: auditData.orgId,
      ...auditData,
    }
  );
  return data
};