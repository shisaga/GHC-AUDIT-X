"use client";
import { Label } from "@/stories/Label/Label";
import React from "react";
import { FaPencilAlt } from "react-icons/fa";
import Link from "next/link";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { Table, TableColumnProps } from "@/stories/Table/Table";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { AdminManagerInfo } from "@/types/user";
import MoreActionButtons from "../Common/MoreMenuWithEditDeleteIcons";
import { MenuItemProps } from "../Common/MoreMenu";
import { fullNameFormatter } from "@/utils/CommonFunction";

interface SOTableProps {
  SO: AdminManagerInfo[];
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

const SOTable: React.FC<SOTableProps> = ({
  SO,
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
  const SOTableColumn: TableColumnProps[] = [
    {
      label: "Name",
      value: "adminName",
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
    },
  ];

  const SOTableData = SO?.map((serviceOrg) => {
    const {
      id,
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
    } = serviceOrg;

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
          <RiDeleteBin5Fill className="text-lg" color="var(--danger-red)" />
        ),
        label: "Delete",
        clickAction: () => {
          handleDelete(id || "");
        },
      },
    ];

    return {
      adminName: (
        <Link
          as={`/service-organization/edit/${id}`}
          href={`/service-organization/edit/[id]`}
        >
          <button className="w-full h-12 flex-center-center text-left">
            <Label
              className="whitespace-nowrap w-full cursor-pointer"
              label={fullNameFormatter(firstName, lastName)}
            />
          </button>
        </Link>
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
        data={SOTableData}
        columns={SOTableColumn}
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

export default SOTable;
