"use client";
import { Label } from "@/stories/Label/Label";
import React, { useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import Link from "next/link";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { Table, TableColumnProps } from "@/stories/Table/Table";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { AdminManagerInfo } from "@/types/user";
import MoreActionButtons from "../Common/MoreMenuWithEditDeleteIcons";
import { MenuItemProps } from "../Common/MoreMenu";
import { useAuth } from "@/contexts/AuthProvider";
import { fullNameFormatter } from "@/utils/CommonFunction";
import { useGetCompanySetting } from "@/hooks/useCompany";
import { CompanyInfo } from "@/types/company";

interface AdminTableProps {
  admins: AdminManagerInfo[];
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

const AdminTable: React.FC<AdminTableProps> = ({
  admins,
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
  const { userInfo, isFetchingUserInfo } = useAuth();
  const { getCompanyInfo } = useGetCompanySetting();
  const [organizationData, setOrganizationData] = useState<CompanyInfo>();

  useEffect(() => {
    if (userInfo?.organizationId) {
      getCompanyInfo(userInfo?.organizationId)
        .then((orgInfo: CompanyInfo) => setOrganizationData(orgInfo))
        .catch((error) => console.log(error));
    }
  }, [userInfo, isFetchingUserInfo]);
  const adminTableColumn: TableColumnProps[] = [
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
      hide: userInfo?.roles?.[0]?.name !== "Admin",
    },
  ];

  const adminTableData = admins?.map((admin) => {
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
    } = admin;

    const address = `${[unit, streetAddress, city, province, country].filter((data) => data).join(", ")}${postalCode ? " - " + postalCode : ""}`;

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
          <RiDeleteBin5Fill className="text-lg" color="var(--danger-red)" style={{opacity:userInfo?.email === email || email === organizationData?.companyEmail ?0.2 : 1 }}  />
        ),
        label: "Delete",
        clickAction: () => {
          handleDelete(id || "");
        },
       
          
        disabled :userInfo?.email === email || email === organizationData?.companyEmail,
      },
    ];

    return {
      adminName:
        userInfo?.roles?.[0]?.name !== "Admin" ? (
          <button className="w-full h-12 flex-center-center text-left">
            <Label
              className="whitespace-nowrap w-full"
              label={fullNameFormatter(firstName, lastName)}
            />
          </button>
        ) : (
          <Link as={`/admins/edit/${id}`} href={`/admins/edit/[id]`}>
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
        data={adminTableData}
        columns={adminTableColumn}
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

export default AdminTable;
