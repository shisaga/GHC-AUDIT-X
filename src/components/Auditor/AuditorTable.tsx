"use client";
import { Label } from "@/stories/Label/Label";
import React from "react";
import { FaPencilAlt } from "react-icons/fa";
import Link from "next/link";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { Table, TableColumnProps } from "@/stories/Table/Table";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { fullNameFormatter } from "@/utils/CommonFunction";
import MoreActionButtons from "@/components/Common/MoreMenuWithEditDeleteIcons";
import { MenuItemProps } from "@/components/Common/MoreMenu";
import { AdminManagerInfo } from "@/types/user";
import { useAuth } from "@/contexts/AuthProvider";

interface AuditorTableProps {
  auditors: AdminManagerInfo[];
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  numberOfPage: number;
  activePage: number;
  setActivePage: (page: number) => void;
  handleSort: (type: string) => void;
  sortType: "asc" | "desc";
  numberOfRecords: number;
  itemsPerPage: number;
  setItemsPerPage?: (itemsPerPage: number) => void;
}

const AuditorTable: React.FC<AuditorTableProps> = ({
  auditors,
  handleEdit,
  handleDelete,
  numberOfPage,
  activePage,
  setActivePage,
  handleSort,
  sortType,
  numberOfRecords,
  itemsPerPage,
  setItemsPerPage,
}) => {
  const { userInfo } = useAuth();
  const auditorTableColumn: TableColumnProps[] = [
    {
      label: "EA#",
      value: "EANumber",
    },
    {
      label: "Name",
      value: "auditorName",
      sortable: true,
      sortFunction: () => handleSort("firstName"),
      sortType,
    },
    { label: "Contact", value: "contact" },
    {
      label: "Address",
      value: "address",
    },
    {
      label: "Actions",
      value: "action",
      className: "text-center",
      hide: userInfo?.roles?.[0]?.name !== "Admin",
    },
  ];

  const auditorTableData = auditors?.map((auditor) => {
    const {
      id,
      EANumber,
      firstName,
      lastName,
      email,
      mobile,
      streetAddress,
      city,
      province,
      country,
      postalCode,
    } = auditor;

    const address = `${[streetAddress, city, province, country].filter((data) => data).join(", ")}${postalCode ? " - " + postalCode : ""}`;
    const menuItems: MenuItemProps[] = [
      {
        iconBackground: "var(--color-neutral-100)",
        icon: <FaPencilAlt color="var(--color-primary)" />,
        label: "Edit",
        clickAction: () => {
          handleEdit(id || "");
        },
      },
      {
        iconBackground: "var(--light-red)",
        icon: (
          <RiDeleteBin5Fill className="text-lg" color="var(--danger-red)" style={{opacity: userInfo?.roles?.[0]?.name === "Auditor" ?0.2 : 1 }} />
        ),
        label: "Delete",
        clickAction: () => {
          handleDelete(id || "");
        },
        disabled :  userInfo?.roles?.[0]?.name === "Auditor" ,      },
    ];

    return {
      EANumber: (
        <button className="w-full h-12 flex-center-center text-left">
          <Label className="whitespace-nowrap w-full" label={EANumber || "-"} />
        </button>
      ),
      auditorName:
        userInfo?.roles?.[0]?.name === "Admin" ? (
          <Link as={`/auditors/edit/${id}`} href={`/auditors/edit/[id]`}>
            <button className="w-full h-12 flex-center-center text-left">
              <Label
                className="whitespace-nowrap w-full cursor-pointer"
                label={fullNameFormatter(firstName, lastName)}
              />
            </button>
          </Link>
        ) : (
          <button className="w-full h-12 flex-center-center text-left">
            <Label
              className="whitespace-nowrap w-full"
              label={fullNameFormatter(firstName, lastName)}
            />
          </button>
        ),
      contact: (
        <div className="flex flex-col whitespace-nowrap">
          {email && (
            <Link href={`mailto:${email}`} className="underline">
              <Label label={email} className="cursor-pointer" />
            </Link>
          )}
          {mobile && (
            <Link href={`tel:${mobile}`} className="underline">
              <Label label={mobile} className="cursor-pointer" />
            </Link>
          )}
          {!email && !mobile && "-"}
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
      action: (
        <div className="flex justify-center">
          <MoreActionButtons
            actionElement={<PiDotsThreeOutlineVerticalFill />}
            items={menuItems}
            placement="left"
          />
        </div>
      ),
    };
  });
  return (
    <div className="overflow-x-auto">
      <Table
        data={auditorTableData}
        columns={auditorTableColumn}
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

export default AuditorTable;
