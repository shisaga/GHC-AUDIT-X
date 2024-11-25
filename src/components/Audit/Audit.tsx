"use client";
import { Button } from "@/stories/Button/Button";
import { Card } from "@/stories/Card/Card";
import { Heading } from "@/stories/Heading/Heading";
import React, { useEffect, useState } from "react";
import { FaFilter, FaPlus, FaRegEdit } from "react-icons/fa";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/navigation";
import { errorToast, successToast } from "@/hooks/toaster/useCustomToaster";
import { Label } from "@/stories/Label/Label";
import LoadingSpinner from "../Common/LoadingSpinner";
import ConformationDialog from "../Common/ConformationDialog";
import { AiOutlineAudit } from "react-icons/ai";
import { useAudits, useDeleteAudit, useMarkAsPaid } from "@/hooks/useAudit";
import FilterSidebar from "./FilterSidebar";
import SBSelect from "@/stories/Select/Select";
import { useAuth } from "@/contexts/AuthProvider";
import MoreMenu, { MenuItemProps } from "../Common/MoreMenu";
import { useFormik } from "formik";
import AuditTable from "./AuditTable";
import { GrPowerReset } from "react-icons/gr";
import { SBTooltip } from "@/stories/Tooltip/Tooltip";
import { EANumberFormatter, fullNameFormatter } from "@/utils/CommonFunction";
import { LoadingButton } from "@/stories/Loading-Button/LoadingButton";

const Audit = () => {
  const router = useRouter();
  const { userInfo } = useAuth();
  const { isUpdating } = useMarkAsPaid();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [limitPerPage, setLimitPerPage] = useState<number>(10);
  const { deleteAudit, isDeleting } = useDeleteAudit();
  const isMobile = useMediaQuery({ maxWidth: 480 });
  const [selectedUser, setSelectedUser] = useState<any>({
    id: "",
    clientName: "",
    EANumber: "",
  });
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] =
    useState<boolean>(false);
  const [openFilterSidebar, setOpenFliterSidebar] = useState<boolean>(false);
  const [selectedAuditList, setSelectedAuditList] = useState<string[]>([]);
  const [openMarkAsPaid, setOpenMarkAsPaid] = useState<boolean>(false);
  const [sortType, setSortType] = useState<string>("All");
  const [filterValues, setFilterValues] = useState<any>([]);
  const {
    data: auditListData,
    isFetching,
    refetch,
  } = useAudits(
    userInfo?.organizationId || "",
    filterValues,
    sortType,
    currentPage,
    limitPerPage
  );

  const handleDeleteAudit = async () => {
    deleteAudit(selectedUser?.id)
      .then(() => {
        successToast(`Audit Deleted Successfully`);
        setSelectedUser("");
        setOpenConfirmDeleteDialog(false);
      })
      .catch((err: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument

        errorToast(err.response.data.error);
        setOpenConfirmDeleteDialog(false);
      });
  };

  const auditSortType = [
    { value: "updatedAt-desc", label: "Last Updated" },
    { value: "firstName-asc", label: "Client (A-Z)" },
    { value: "firstName-desc", label: "Client (Z-A)" },
    { value: "auditCost-asc", label: "Cost (Lowest)" },
    { value: "auditCost-desc", label: "Cost (Highest)" },
    { value: "createdAt-asc", label: "Audit Date (Earliest)" },
    { value: "createdAt-desc", label: "Audit Date (Latest)" },
  ];

  const auditTableMenuItem: MenuItemProps[] = [
    {
      icon: <AiOutlineAudit className="text-lg" />,
      label: "Single",
      clickAction: () => router.push("/audits/single/add"),
    },
    {
      icon: <AiOutlineAudit className="text-lg" />,
      label: "D and E",
      clickAction: () => router.push("/audits/dual/add"),
    },
  ];

  const formik = useFormik({
    validateOnChange: true,
    initialValues: {
      keyword: "",
      auditMode: "",
      auditor: "",
      contractor: "",
      province: "",
      status: "",
      leadType: "",
      createdDate: "",
      auditDate: "",
      lastStatusChangeDate: "",
      paymentDate: "",
      lastStatusChangeUser: "",
      invoice: "",
      report: "",
      paid: "",
      paidTo: "",
      EABalancedClear: "",
      paymentType: "",
      contractorBalanceCleared: "",
      SOBalanceCleared: "",
      hasPhotos: "",
    },
    onSubmit: (values) => {
      setCurrentPage(0);
      setFilterValues(values);
    },
  });

  useEffect(() => {
    refetch();
  }, [sortType, currentPage, limitPerPage, filterValues]);

  const handleAuditSelect = (id: string | "All") => {
    let selectedAudit = selectedAuditList.length ? [...selectedAuditList] : [];
    if (id === "All") {
      if (
        selectedAudit.length ===
        auditListData?.data?.filter((data: any) => !data?.paid).length
      ) {selectedAudit=[]
      } else {
        selectedAudit =
          auditListData?.data
            ?.filter((payment: any) => !payment?.paid)
            .map((payment: any) => payment?.id || "") ?? [];
      }
    } else {
      if (selectedAudit.includes(id)) {
        const index = selectedAudit.indexOf(id);
        selectedAudit.splice(index, 1);
      } else {
        selectedAudit.push(id);
      }
    }
    setSelectedAuditList([...selectedAudit]);
  };

  const getBulkUpdateButton = () => {
    return isUpdating ? (
      <LoadingButton
        label={isMobile ? "" : "Bulk Updating"}
        icon={<FaRegEdit />}
        variant="outline-primary"
      />
    ) : (
      <Button
        label={
          isMobile
            ? `(${selectedAuditList.length})`
            : `Bulk Update (${selectedAuditList.length})`
        }
        icon={<FaRegEdit />}
        variant="outline-primary"
        onClick={() => setOpenMarkAsPaid(true)}
      />
    );
  };

  return (
    <>
      <div className="md:p-6 p-4 flex flex-col lg:gap-5 gap-4">
        <div className="flex justify-between items-center">
          <Heading label="Audits" type="h2" />
          {userInfo?.roles?.[0].name !== "Contractor" && (
            <div className="flex items-center justify-between gap-4">
              {selectedAuditList.length > 0 &&
                userInfo?.roles?.[0]?.name === "Admin" &&
                getBulkUpdateButton()}
              <Button
                id="clear-audit-filter"
                icon={<GrPowerReset className="text-lg font-bold" />}
                label=""
                variant="outline-gray"
                backgroundColor="var(--color-white)"
                onClick={async () => {
                  setFilterValues([]);
                }}
              />
              <SBTooltip
                place="bottom"
                message="Clear filter"
                id="clear-audit-filter"
                className="max-w-full !text-xs -mt-3"
              />
              <Button
                label={isMobile ? "" : "Filter"}
                icon={<FaFilter className="text-sm" />}
                onClick={() => setOpenFliterSidebar(true)}
              />
              <MoreMenu
                actionElement={
                  <Button
                    label={isMobile ? "" : "Create"}
                    icon={<FaPlus />}
                    variant="primary"
                    hide={userInfo?.roles?.[0]?.name === "Contractor"}
                  />
                }
                actionElementClass="!w-fit max-h-[40px]"
                items={auditTableMenuItem}
                placement="bottom-end"
              />
            </div>
          )}
        </div>
        <Card className="flex flex-col">
          <div className="md:px-6 px-4 py-4 mt-4 justify-between items-center grid md:grid-cols-3 grid-cols-1 gap-3">
            <div className="relative">
              <input
                className={`${
                  !formik.values.keyword && !auditListData?.data?.length
                    ? "cursor-not-allowed"
                    : ""
                } w-full form-input peer`}
                placeholder=""
                type="search"
                id="keyword"
                name="keyword"
                value={formik.values.keyword}
                onChange={(e) => {
                  formik.setFieldTouched(
                    e?.target?.name || e?.target?.id,
                    true
                  );
                  formik.handleChange(e);
                  const delayDebounceFn = setTimeout(() => {
                    formik.handleSubmit();
                  }, 1000);
                  return () => clearTimeout(delayDebounceFn);
                }}
                disabled={
                  !formik.values.keyword && !auditListData?.data?.length
                }
              />
              <label
                htmlFor="user-search" // Associate the label with the input
                className="absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 bg-white"
              >
                Search Audits
              </label>
            </div>
            <div></div>
            <div>
              <SBSelect
                id={`sortType`}
                label={"Sort"}
                value={sortType}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                onChange={(e) => setSortType(e || "")}
                options={auditSortType.map((element) => {
                  return { value: element.value, label: element.label };
                })}
              />
            </div>
          </div>
          {isFetching ? (
            <LoadingSpinner />
          ) : auditListData && auditListData?.data?.length ? (
            <AuditTable
              audits={auditListData?.data || []}
              // eslint-disable-next-line @typescript-eslint/unbound-method
              numberOfPage={auditListData?.totalPages}
              activePage={currentPage}
              setActivePage={(page) => setCurrentPage(page)}
              selectedAuditList={selectedAuditList}
              setSelectedAuditList={setSelectedAuditList}
              handleAuditSelect={handleAuditSelect}
              openMarkAsPaid={openMarkAsPaid}
              setOpenMarkAsPaid={setOpenMarkAsPaid}
              handleEdit={(id) => {
                setSelectedUser({ id: id });
              }}
              handleDelete={(id) => {
                const auditDetails = auditListData?.data.find((user) => {
                  return user?.id === id;
                });

                if (auditDetails) {
                  setSelectedUser({
                    id: auditDetails?.id,
                    clientName: fullNameFormatter(
                      auditDetails?.client?.firstName,
                      auditDetails?.client?.lastName
                    ),
                    EANumber: EANumberFormatter(
                      auditDetails?.auditor?.EANumber,
                      auditDetails.auditMode,
                      auditDetails?.audit
                    ),
                  });
                }
                setOpenConfirmDeleteDialog(true);
              }}
              // eslint-disable-next-line @typescript-eslint/unbound-method
              numberOfRecords={auditListData?.totalItem}
              itemsPerPage={limitPerPage}
              setItemsPerPage={setLimitPerPage}
            />
          ) : (
            <div className="flex-center-center flex-col gap-5 p-10">
              {formik?.values?.keyword ? (
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
                    label="Let’s add audit and get going!"
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
          handleDeleteAudit();
        }}
        userToDelete={
          selectedUser?.clientName === "-"
            ? selectedUser?.EANumber
            : selectedUser?.clientName
        }
        setOpenModal={() => {
          setSelectedUser("");
          setOpenConfirmDeleteDialog(false);
        }}
      />
      <FilterSidebar
        formik={formik}
        open={openFilterSidebar}
        close={() => {
          setOpenFliterSidebar(false);
        }}
        // id={selectedClient}
      />
    </>
  );
};

export default Audit;
