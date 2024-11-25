"use client";
import { Label } from "@/stories/Label/Label";
import React, { Dispatch, SetStateAction, useState } from "react";
import { FaEye, FaPencilAlt, FaPlus } from "react-icons/fa";
import Link from "next/link";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { Table, TableColumnProps } from "@/stories/Table/Table";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { AuditFormData } from "@/types/user";
import MoreActionButtons from "../Common/MoreMenuWithEditDeleteIcons";
import { MenuItemProps } from "../Common/MoreMenu";
import {
  PRIORITY_STATUS_VALUE,
  STATUS_BG_COLOR,
  STATUS_TEXT_COLOR,
} from "@/utils/constant";
import { Checkbox, Chip } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import AuditDetailSidebar from "./AuditDetailSidebar";
import { convertAuditType } from "@/hooks/useAudit";
import {
  EANumberFormatter,
  formatAmount,
  fullNameFormatter,
} from "@/utils/CommonFunction";
import { generateInvoicePaymentSection } from "@/hooks/useInvoice";
import { useAuth } from "@/contexts/AuthProvider";
import { FiCheckCircle } from "react-icons/fi";
import MarkAsPaidSidebar from "./MarkAsPaidSidebar";
import { closeToast, loadingToast } from "@/hooks/toaster/useCustomToaster";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";

interface AuditTableProps {
  audits: AuditFormData[];
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  numberOfPage: number;
  activePage: number;
  handleAuditSelect: (id: string) => void;
  setActivePage: (page: number) => void;
  selectedAuditList: string[];
  setSelectedAuditList: Dispatch<SetStateAction<string[]>>;
  openMarkAsPaid: boolean;
  setOpenMarkAsPaid: Dispatch<SetStateAction<boolean>>;
  handleSort?: (type: string) => void;
  sortType?: "asc" | "desc";
  numberOfRecords: number;
  itemsPerPage: number;
  setItemsPerPage?: (itemsPerPage: number) => void;
}

const AuditTable: React.FC<AuditTableProps> = ({
  audits,
  handleEdit,
  handleDelete,
  numberOfPage,
  activePage,
  setActivePage,
  selectedAuditList,
  openMarkAsPaid,
  setOpenMarkAsPaid,
  setSelectedAuditList,
  handleSort,
  sortType,
  handleAuditSelect,
  numberOfRecords,
  itemsPerPage,
  setItemsPerPage,
}) => {
  const router = useRouter();
  const { userInfo } = useAuth();
  const [auditDetailSidebarOpen, setAuditDetailSidebarOpen] =
    useState<boolean>(false);
  const [selectedAudit, setSelectedAudit] = useState({});

  const auditTableColumn: TableColumnProps[] = [
    {
      label: (
        <Checkbox
          onChange={() => handleAuditSelect("All")}
          checked={
            selectedAuditList.length ===
            audits.filter((data: any) => !data?.paid).length &&  selectedAuditList.length !=0
          }
        />
      ),
      value: "select",
      hide: userInfo?.roles?.[0]?.name !== "Admin",
    },
    {
      label: "Audit#",
      value: "auditId",
    },
    { label: "Client", value: "client" },
    {
      label: "Address",
      value: "address",
    },
    {
      label: "Audit Cost",
      value: "auditCost",
      className: "text-right",
    },
    {
      label: "Payment Status",
      value: "paid",
      className: "text-center",
    },
    {
      label: "Status",
      value: "status",
      className: "text-center",
    },
    {
      label: "Priority",
      value: "priority",
      className: "text-center",
    },
    {
      label: "Actions",
      value: "action",
      className: "text-center",
    },
  ];

  const auditTableData = audits?.map((auditData: any) => {
    let {
      id,
      clientId,
      auditType,
      auditMode,
      audit,
      leadType,
      auditStatus,
      auditDate,
      startTime,
      endTime,
      application,
      priority,
      auditCost,
      paid,
      paidBy,
      EABalanceCleared,
      contractorBalanceCleared,
      SOBalanceCleared,
      paymentType,
      paymentDate,
      reportSent,
      invoiceSent,
      SONotes,
      auditCalanderSetting,
      SOId,
      createdAt,
      updatedAt,
      client: {
        firstName,
        lastName,
        email,
        mobile,
        unit,
        streetAddress,
        city,
        province,
        country,
        postalCode,
        creatorId,
        calculatedSum,
        preferredContactMethod,
      },
    }: any = auditData;

    const auditor = {
      id: "",
      EANumber: "",
      firstName: "",
      lastName: "",
      email: "",
      imgUrl: "",
      mobile: "",
      SOFee: "",
    };

    const contractor = {
      id: "",
      EANumber: "",
      firstName: "",
      lastName: "",
      email: "",
      imgUrl: "",
      mobile: "",
      SOFee: "",
    };

    if (auditData?.auditor) {
      auditor.id = auditData?.auditor.id;
      auditor.EANumber = auditData?.auditor.EANumber;
      auditor.firstName = auditData?.auditor.firstName;
      auditor.lastName = auditData?.auditor.lastName;
      auditor.email = auditData?.auditor.email;
      auditor.imgUrl = auditData?.auditor.imgUrl;
      auditor.mobile = auditData?.auditor.mobile;
    }
    if (auditData?.contractor) {
      contractor.id = auditData?.contractor.id;
      contractor.firstName = auditData?.contractor.firstName;
      contractor.lastName = auditData?.contractor.lastName;
      contractor.email = auditData?.contractor.email;
      contractor.imgUrl = auditData?.contractor.imgUrl;
      contractor.mobile = auditData?.contractor.mobile;
    }

    const address = `${[unit, streetAddress, city, province, country].filter((data) => data).join(", ")}${postalCode ? " - " + postalCode : ""}`;

    const convertToDualAudit = async (id: any) => {
      const data: any = await convertAuditType(id, auditData).catch(e=>console.log(e))
      if (id) router.push(`/audits/dual/edit/${id}?type=converted`);

    };

    const menuItems: MenuItemProps[] = [
      {
        iconBackground: "var(--color-neutral-100)",
        icon: <FaPencilAlt color="var(--color-primary)" />,
        label: "Edit",
        clickAction: () => router.push(`/audits/${auditType}/edit/${clientId}`),
        hide: userInfo?.roles?.[0]?.name === "Contractor",
      },
      {
        iconBackground: "var(--color-neutral-100)",
        icon: <FaEye color="var(--color-primary)" />,
        label: "View",
        clickAction: () => {
          setSelectedAudit(auditData);
          setAuditDetailSidebarOpen(true);
        },
      },
      userInfo?.roles?.[0]?.name !== "Contractor" &&
        (() =>
          auditType === "single" && auditMode === "D" 
            ? {
                icon: <FaPlus />,
                label: ` ${auditMode === "D" ? "E Audit" : ""} `,
                clickAction: () => convertToDualAudit(clientId),
              }
            : (null as any))(),
      ...(userInfo?.roles?.[0]?.name === "Admin" ||
      userInfo?.roles?.[0]?.name === "Manager"
        ? [
            {
              icon: <LiaFileInvoiceDollarSolid className="text-lg" />,
              label: "Invoice",
              clickAction: async () => {
            
                const toastId = loadingToast("Fetching Invoice...");
                const res = await generateInvoicePaymentSection(
                  {
                    data: { auditId: id },
                    orgId: userInfo?.organizationId,
                  },
                  "ghc-auditor"
                );
                if (res.s3Url?.[0].downloadUrl) {
                  closeToast(toastId);
                  window.open(res.s3Url?.[0].downloadUrl);
                }
                closeToast(toastId);
              },
              hide: auditCost == 0,
            },
            {
              iconBackground: "var(--light-red)",
              icon: (
                <RiDeleteBin5Fill
                  className="text-lg"
                  color="var(--danger-red)"
                />
              ),
              label: "Delete",
              clickAction: () => {
                handleDelete(id || "");
              },
            },
            {
              icon: (
                <FiCheckCircle className="text-lg" color="var(--color-green)" />
              ),
              label: "Mark as Paid",
              clickAction: () => {
                setSelectedAuditList([id]);
                setOpenMarkAsPaid(true);
              },
              hide: paid === true || auditCost == 0,
            },
          ]
        : []),
    ].filter(Boolean);

    return {
      select: (
        <Checkbox
          id={id}
          name={id}
          disabled={paid}
          className="disabled:bg-colorLighter"
          checked={selectedAuditList?.includes(id)}
          onChange={() => handleAuditSelect(id)}
        />
      ),
      auditId:
        userInfo?.roles?.[0]?.name === "Contractor" ? (
          <Label
            className="whitespace-nowrap w-full"
            label={EANumberFormatter(auditor.EANumber, auditMode, audit)}
          />
        ) : (
          <button className="w-full h-12 hover:underline flex-center-center text-left">
            <Label
              className="whitespace-nowrap w-full cursor-pointer"
              onClick={() =>
                router.push(`/audits/${auditType}/edit/${clientId}`)
              }
              label={EANumberFormatter(auditor.EANumber, auditMode, audit)}
            />
          </button>
        ),
      client: (
        <div className="flex flex-col whitespace-nowrap">
          <Label
            className="whitespace-nowrap w-full"
            label={fullNameFormatter(firstName, lastName)}
          />
        </div>
      ),
      address: address ? (
        <Link
          href={`https://www.google.com/maps/search/?api=1&query=${address}`}
          target="_blank"
        >
          <Label
            label={address}
            className="line-clamp-2 cursor-pointer min-w-72"
            title={address}
          />
        </Link>
      ) : (
        " - "
      ),
      auditCost: (
        <div className="flex flex-col whitespace-nowrap">
          <Label
            className="whitespace-nowrap w-full text-right"
            label={formatAmount(auditCost)}
          />
        </div>
      ),
      paid: (
        <div className="flex flex-col items-center whitespace-nowrap" id={id}>
          <Chip
            className={`${
              paid ? "bg-[#26B846]" : "bg-[#ffc107]"
            } !text-white w-fit min-w-[70px] capitalize text-center`}
            value={paid ? "Paid" : "Unpaid"}
          />
        </div>
      ),
      status: (
        <div className="flex flex-col items-center whitespace-nowrap">
          {auditStatus ? (
            <Chip
              style={{
                backgroundColor: STATUS_BG_COLOR[auditStatus || "-"],
                color: STATUS_TEXT_COLOR[auditStatus || "#ffffff"],
              }}
              className={` text-center`}
              value={auditStatus}
            />
          ) : (
            "-"
          )}
        </div>
      ),
      priority: (
        <div className="flex flex-col items-center whitespace-nowrap">
          {priority === "" ||
          priority === null ||
          priority === undefined ||
          priority == 3 ? (
            "-"
          ) : (
            <Label
              className="whitespace-nowrap w-full text-center"
              label={PRIORITY_STATUS_VALUE[+priority]}
            />
          )}
        </div>
      ),

      action: (
        <div className="flex justify-center">
          <MoreActionButtons
            actionElement={
              <PiDotsThreeOutlineVerticalFill
                color="var(--color-primary)"
                className="text-lg"
              />
            }
            items={[...menuItems]}
            placement="left"
            editView={true}
            actionElementClass="!bg-colorLighter rounded-normal"
          />
        </div>
      ),
    };
  });
  return (
    <div className="overflow-x-auto">
      <Table
        data={auditTableData}
        columns={auditTableColumn}
        pagination={{
          activePage,
          setActivePage,
          numberOfPage,
          numberOfRecords,
          itemsPerPage,
          setItemsPerPage,
          hidePagination: false,
        }}
      />

      <AuditDetailSidebar
        open={auditDetailSidebarOpen}
        close={() => setAuditDetailSidebarOpen(false)}
        data={selectedAudit}
      />
      <MarkAsPaidSidebar
        open={openMarkAsPaid}   
        close={() => {
          setSelectedAuditList([]);
          setOpenMarkAsPaid(false);
        }}
        ids={selectedAuditList}
      />
    </div>
  );
};

export default AuditTable;
