"use client";
import { Button } from "@/stories/Button/Button";
import { Card } from "@/stories/Card/Card";
import { Heading } from "@/stories/Heading/Heading";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useMediaQuery } from "react-responsive";
import SOTable from "./SOTable";
import { useRouter } from "next/navigation";
import { Label } from "@/stories/Label/Label";
import LoadingSpinner from "../Common/LoadingSpinner";
import ConformationDialog from "../Common/ConformationDialog";
import { useDeleteUsers, useUsers } from "@/hooks/useUser";
import { USER_ROLE } from "@/types/roles";
import { errorToast, successToast } from "@/hooks/toaster/useCustomToaster";
import { useAuth } from "@/contexts/AuthProvider";

const ServiceOrganization = () => {
  const router = useRouter();
  const { userInfo } = useAuth();
  // const { data: userData, isLoading } = useAllUsers();
  const [sortType, setSortType] = useState<"asc" | "desc">("desc");
  const [searchString, setSearchString] = useState<string | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 480 });
  const { deleteUsers, isDeleting } = useDeleteUsers();

  const [selectedUser, setSelectedUser] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [limitPerPage, setLimitPerPage] = useState<number>(10);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] =
    useState<boolean>(false);

  const { data, isFetching, refetch } = useUsers(
    currentPage,
    limitPerPage,
    searchString || "",
    sortType,
    USER_ROLE.SO,
    userInfo?.organizationId as any
  );

  const handleDeleteUsers = async () => {
    deleteUsers(selectedUser)
      .then(() => {
        successToast(`SO Deleted Successfully`);
        setSelectedUser("");
        setOpenConfirmDeleteDialog(false);
      })
      .catch((err: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        errorToast(err);
        setOpenConfirmDeleteDialog(false);
      });
  };
  useEffect(() => {
    refetch();
  }, [sortType, currentPage, limitPerPage]);

  useEffect(() => {
    if (searchString !== null) {
      const delayDebounceFn = setTimeout(() => {
        refetch();
      }, 1000);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchString]);

  const handleSort = () => {
    setSortType(sortType === "desc" ? "asc" : "desc");
  };

  return (
    <>
      <div className="md:p-6 p-4 flex flex-col lg:gap-5 gap-4">
        <div className="flex justify-between items-center">
          <Heading label="Service Organization" type="h2" />
          <Button
            label={isMobile ? "" : "Create"}
            icon={<FaPlus />}
            variant="primary"
            onClick={() => router.push("/service-organization/add")}
            hide={userInfo?.roles?.[0]?.name !== "Admin"}
          />
        </div>
        <Card className="flex flex-col">
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <input
                className={`${
                  !searchString && !data?.data.length
                    ? "cursor-not-allowed"
                    : ""
                } w-full form-input peer`}
                id="user-search" // Keep the same id for the input
                placeholder=""
                type="search"
                value={searchString || ""}
                disabled={!searchString && !data?.data.length}
                onChange={(e) => {
                  const { value } = e.target;
                  setCurrentPage(0);
                  setSearchString(value);
                }}
              />
              <label
                htmlFor="user-search" // Associate the label with the input
                className="absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 bg-white"
              >
                Search SO
              </label>
            </div>
          </div>
          {isFetching ? (
            <LoadingSpinner />
          ) : data && data?.data?.length > 0 ? (
            <SOTable
              SO={data?.data || []}
              // eslint-disable-next-line @typescript-eslint/unbound-method
              numberOfPage={data?.totalPages}
              activePage={currentPage}
              setActivePage={(page) => setCurrentPage(page)}
              handleSort={handleSort}
              sortType={sortType}
              handleEdit={(id) => {
                setSelectedUser(id);
                router.push(`/service-organization/edit/${id}`);
              }}
              handleDelete={(id) => {
                setSelectedUser(id);
                setOpenConfirmDeleteDialog(true);
              }}
              // eslint-disable-next-line @typescript-eslint/unbound-method
              numberOfRecords={data?.totalItem}
              itemsPerPage={limitPerPage}
              setItemsPerPage={setLimitPerPage}
            />
          ) : (
            <div className="flex-center-center flex-col gap-5 p-10">
              {searchString ? (
                <div className="text-center">
                  <Label
                    label="No results found based on the applied filters. Try adjusting your search criteria."
                    className="font-semibold text-colorLight text-center"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <Heading
                    color="var(--color-neutral-700)"
                    label="Let’s add service organization and get going!"
                    type="h4"
                  />
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
      <ConformationDialog
        open={openConfirmDeleteDialog}
        processing={isDeleting}
        onConfirm={() => {
          handleDeleteUsers();
        }}
        setOpenModal={() => {
          setSelectedUser("");
          setOpenConfirmDeleteDialog(false);
        }}
      />
    </>
  );
};

export default ServiceOrganization;
