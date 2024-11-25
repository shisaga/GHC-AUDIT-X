"use client";
import { Label } from "@/stories/Label/Label";
import React from "react";
import { FaPencilAlt } from "react-icons/fa";
import Link from "next/link";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { Table, TableColumnProps } from "@/stories/Table/Table";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { AdminManagerInfo } from "@/types/user";
import { fullNameFormatter } from "@/utils/CommonFunction";
import MoreActionButtons from "../Common/MoreMenuWithEditDeleteIcons";
import { MenuItemProps } from "../Common/MoreMenu";
import { useAuth } from "@/contexts/AuthProvider";

interface ManagerTableProps {
  managers: AdminManagerInfo[];
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

const ManagerTable: React.FC<ManagerTableProps> = ({
  managers,
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
  const managerTableColumn: TableColumnProps[] = [
    {
      label: "Name",
      value: "managerName",
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
      hide:
        userInfo?.roles?.[0].name === "Auditor" ||
        userInfo?.roles?.[0].name === "Contractor",
    },
  ];

  const managerTableData = managers?.map((manager) => {
    const {
      id,
      firstName,
      lastName,
      email,
      mobile,
      streetAddress,
      unit,
      city,
      province,
      country,
      postalCode,
    } = manager;

    const address = `${[unit, streetAddress, city, province, country].filter((data) => data).join(", ")}${postalCode ? " - " + postalCode : ""}`;
    const menuItems: MenuItemProps[] = [
      {
        iconBackground: "var(--color-neutral-100)",
        icon: <FaPencilAlt color="var(--color-primary)" />,
        label: "Edit",
        clickAction: () => {
          handleEdit(id || "");
        },
        hide: userInfo?.roles?.[0]?.name === "Manager",
      },
      {
        iconBackground: "var(--light-red)",
        icon: (
          <RiDeleteBin5Fill className="text-lg" color="var(--danger-red)"  style={{opacity:userInfo?.roles?.[0]?.name === "Manager" ?0.2 : 1 }}/>
        ),
        label: "Delete",
        clickAction: () => {
          handleDelete(id || "");
        },
      
        disabled : userInfo?.roles?.[0]?.name === "Manager",
      },
    ];

    return {
      managerName:
        userInfo?.roles?.[0].name === "Admin" ? (
          <Link as={`/managers/edit/${id}`} href={`/managers/edit/[id]`}>
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
        data={managerTableData}
        columns={managerTableColumn}
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

export default ManagerTable;
