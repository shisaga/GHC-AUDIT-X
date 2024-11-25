"use client";
import { Label } from "@/stories/Label/Label";
import React, { Dispatch, SetStateAction } from "react";
import { Table, TableColumnProps } from "@/stories/Table/Table";
import { formatAmount, fullNameFormatter } from "@/utils/CommonFunction";
import { Checkbox, Chip } from "@material-tailwind/react";
import { useAuth } from "@/contexts/AuthProvider";

interface ClientPaymentTableProps {
  data: any[];
  handleGenerateInvoice: (id: string) => void;
  selectedPayment: string[];
  setSelectedPaymentList: Dispatch<SetStateAction<string[]>>;
  numberOfPage: number;
  activePage: number;
  setActivePage: (page: number) => void;
  handleSort?: (type: string) => void;
  sortType: string;
  numberOfRecords: number;
  itemsPerPage: number;
  setItemsPerPage?: (itemsPerPage: number) => void;
  handlePaymentSelect: (id: string) => void;
}

const GHCToAuditorTable: React.FC<ClientPaymentTableProps> = ({
  data,
  handleGenerateInvoice,
  numberOfPage,
  activePage,
  selectedPayment,
  setSelectedPaymentList,
  setActivePage,
  handleSort,
  sortType,
  numberOfRecords,
  itemsPerPage,
  setItemsPerPage,
  handlePaymentSelect,
}) => {
  const { userInfo } = useAuth();

  const ClientPaymentTableColumn: TableColumnProps[] = [
    {
      label: (
        <Checkbox
          onChange={() => handlePaymentSelect("All")}
          checked={
            selectedPayment.length ===
            data.filter((data: any) => !data?.paid).length &&  selectedPayment.length !=0
          }
        />
      ),
      value: "select",
      hide:
        userInfo?.roles?.[0]?.name === "Auditor" ||
        userInfo?.roles?.[0]?.name === "Contractor",
    },
    {
      label: "Auditor",
      value: "auditor",
    },
    {
      label: "Client",
      value: "client",
    },
    {
      label: "Amount",
      value: "amount",
      className: "text-right",
    },
    {
      label: "Payment Status",
      value: "paymentStatus",
      className: "text-center",
    },
    {
      label: "Invoice",
      value: "invoice",
      className: "text-center",
    },
  ];

  const ClientPaymentTableData = data?.map((clientPayment) => {
    const {
      id,
      auditId,
      auditMode,
      clientFirstName,
      clientLastName,
      auditor,
      userFirstName,
      userLastName,
      userId,
      amount,
      paid,
      summaryInvoiceNo,
      invoiceId,
    } = clientPayment;

    return {
      select: (
        <Checkbox
          id={auditId}
          name={auditId}
          disabled={paid}
          className="disabled:bg-colorLighter"
          checked={selectedPayment?.includes(auditId)}
          onChange={() => handlePaymentSelect(auditId)}
        />
      ),
      auditor: (
        <Label
          className="whitespace-nowrap w-full"
          label={fullNameFormatter(userFirstName, userLastName)}
        />
      ),
      client: (
        <Label
          className="whitespace-nowrap w-full"
          label={fullNameFormatter(clientFirstName, clientLastName)}
        />
      ),
      amount: (
        <Label
          className="whitespace-nowrap flex flex-col text-right"
          label={formatAmount(amount)}
        />
      ),
      paymentStatus: (
        <div className="flex flex-col items-center whitespace-nowrap" id={id}>
          <Chip
            className={`${
              paid ? "bg-[#26B846]" : "bg-[#ffc107]"
            } !text-white w-fit min-w-[70px] capitalize text-center`}
            value={paid ? "Paid" : "Unpaid"}
          />
        </div>
      ),
      invoice: (
        <Label
          className={`${userInfo?.roles?.[0]?.name === "Admin" || userInfo?.roles?.[0]?.name === "Manager" ? "hover:underline cursor-pointer" : invoiceId ? "hover:underline cursor-pointer" : "cursor-not-allowed "} whitespace-nowrap w-full flex items-center justify-center`}
          color="var(--color-primary)"
          label={
            userInfo?.roles?.[0]?.name === "Admin" ||
            userInfo?.roles?.[0]?.name === "Manager"
              ? "View"
              : invoiceId
                ? "View"
                : "-"
          }
          onClick={() => {
            userInfo?.roles?.[0]?.name === "Admin" ||
            userInfo?.roles?.[0]?.name === "Manager"
              ? handleGenerateInvoice(clientPayment)
              : invoiceId
                ? handleGenerateInvoice(clientPayment)
                : null;
          }}
        />
      ),
    };
  });
  return (
    <div className="overflow-x-auto">
      <Table
        data={ClientPaymentTableData}
        columns={ClientPaymentTableColumn}
        pagination={{
          activePage,
          setActivePage,
          numberOfPage,
          numberOfRecords,
          itemsPerPage,
          setItemsPerPage,
        }}
      />
    </div>
  );
};

export default GHCToAuditorTable;
