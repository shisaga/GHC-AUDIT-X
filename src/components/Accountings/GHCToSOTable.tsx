"use client";
import { Label } from "@/stories/Label/Label";
import React, { Dispatch, SetStateAction } from "react";
import { Table, TableColumnProps } from "@/stories/Table/Table";
import { useAuth } from "@/contexts/AuthProvider";
import { formatAmount, fullNameFormatter } from "@/utils/CommonFunction";
import { Checkbox, Chip } from "@material-tailwind/react";

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

const GHCToSOTable: React.FC<ClientPaymentTableProps> = ({
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
      label: "Service Organization",
      value: "so",
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
      so: (
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
          className="whitespace-nowrap w-full hover:underline cursor-pointer"
          color="var(--color-primary)"
          label={"View"}
          onClick={() => handleGenerateInvoice(clientPayment)}
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

export default GHCToSOTable;
