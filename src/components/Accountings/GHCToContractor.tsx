"use client";
import { Card } from "@/stories/Card/Card";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import LoadingSpinner from "../Common/LoadingSpinner";
import { Label } from "@/stories/Label/Label";
import { Heading } from "@/stories/Heading/Heading";
import { useAccounting } from "@/hooks/useAccounting";
import { Button } from "@/stories/Button/Button";
import { FaFilter, FaRegEdit } from "react-icons/fa";
import { useMediaQuery } from "react-responsive";
import { USER_ROLE, getUserRole } from "@/types/roles";
import GHCToContractorTable from "./GHCToContractorTable";
import { generateBulkInvoice, getInvoice } from "@/hooks/useInvoice";
import {
  closeToast,
  errorToast,
  loadingToast,
  successToast,
} from "@/hooks/toaster/useCustomToaster";
import { useAuth } from "@/contexts/AuthProvider";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { GrPowerReset } from "react-icons/gr";
import SBSelect from "@/stories/Select/Select";
import FilterSidebarAccounting from "./FilterSidebarAccounting";
import { LoadingButton } from "@/stories/Loading-Button/LoadingButton";
import { useUpdatePaymentStatus } from "@/hooks/useAudit";
import { useFormik } from "formik";
import { getAllUsers } from "@/hooks/useUser";
import { FilterValues } from "./GHCToAuditor";
import { useQueryClient } from "react-query";
import AccountingMobileMenu from "./AccountingMobileMenu";
import ConformationDialog from "../Common/ConformationDialog";

const GHCToAuditor = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}) => {
  const { userInfo } = useAuth();
  const queryClient = useQueryClient();
  const [sortType, setSortType] = useState<string>("All");
  const isMobile = useMediaQuery({ maxWidth: 480 });
  const isTablet = useMediaQuery({ maxWidth: 959 });
  const [selectedPaymentList, setSelectedPaymentList] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [limitPerPage, setLimitPerPage] = useState<number>(10);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const { isUpdating, updateBulkStatus } = useUpdatePaymentStatus();
  const [openFilterSidebar, setOpenFliterSidebar] = useState<boolean>(false);
  const [contractorList, setContractorList] = useState<any>([]);
  const [selectedContractor, setSelectedContractor] = useState<any>("");
  const [warning, setWarning] = useState<any>(false);
  const [waringPaid, setWaringPaid] = useState(false)
  const [disable ,setDisableState] = useState(false);

  const auditSortType = [
    { value: "createdAt-asc", label: "Audit Date (Earliest)" },
    { value: "createdAt-desc", label: "Audit Date (Latest)" },
  ];
  const [filter, setFilter] = useState<FilterValues>({
    keyword: "",
    startDate: 0,
    endDate: 0,
    assignee:
      userInfo?.roles?.[0]?.name === "Contractor"
        ? (userInfo?.id as string)
        : "",
    userType: USER_ROLE.CONTRACTOR,
    paid: null,
    auditMode: "",
    summaryInvoiceId: "",
  });

  const { isLoading, data, refetch } = useAccounting({
    filter,
    sort: sortType,
    pageSize: limitPerPage,
    page: currentPage,
  });

  const formik = useFormik({
    validateOnChange: true,
    initialValues: {
      keyword: "",
      startDate: 0,
      endDate: 0,
      assignee:
        userInfo?.roles?.[0]?.name === "Contractor"
          ? (userInfo?.id as string)
          : "",
      userType: USER_ROLE.CONTRACTOR,
      paid: null,
      auditMode: "",
      summaryInvoiceId: "",
    },
    onSubmit: (values: FilterValues) => {
      setFilter(values);
      setCurrentPage(0);
      setOpenFliterSidebar(false);
    },
  });

  const handleSort = () => {
    setSortType(sortType === "All" ? "All" : "desc");
  };

  const handlePaymentSelect = (id: string | "All") => {

    let selectedPayment = selectedPaymentList.length
      ? [...selectedPaymentList]
      : [];
    if (id === "All") {
      if (
        selectedPayment.length ===
        data?.data?.data?.filter((data: any) => !data?.paid).length
      ) {
        selectedPayment = [];

      } else {
        selectedPayment =
          data?.data?.data
            ?.filter((payment: any) => !payment.paid)
            ?.map((payment: any) => payment.auditId || "") ?? [];
      }
    } else {
      if (selectedPayment.includes(id)) {
        const index = selectedPayment.indexOf(id);
        selectedPayment.splice(index, 1);
      } else {
        selectedPayment.push(id);
      }
    }
    setSelectedPaymentList([...selectedPayment]);
  };

  const handleGenerateInvoice = async (data: any) => {
    setDisableState(true)
    const toastId = loadingToast("Fetching Invoice...");
    if (data.summaryInvoiceNo && data.invoiceId) {
      const res: any = await getInvoice({
        id: data.invoiceId,
        type: "ghc-contractor",
      });
      if (res?.s3Url.downloadLink) closeToast(toastId);
      window.open(res?.s3Url?.downloadLink, "_blank");
    } else {
      const res: any = await generateBulkInvoice(
        {
          auditorId: selectedPaymentList,
          data: [data.id],
          orgId: userInfo?.organizationId,
          isSingle: true,
        },
        "ghc-contractor"
      );

      if (res?.data.s3Url.downloadLink) closeToast(toastId);
      window.open(res?.data.s3Url?.downloadLink, "_blank");
    }
    setDisableState(false)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  };
  const checkPaymentList = () => {
    if (selectedPaymentList.length) {

      const current = data?.data?.data
        ?.map((dataItem: any) => {
        
          if (selectedPaymentList.includes(dataItem.auditId)) {
            return dataItem;
          } else {
            return null;
          }
          // Return null for non-matching items
        })
        .filter(Boolean)
        .filter((ele: any) => ele?.summaryInvoiceNo !== null).length;
      if (current > 0) {
        setWarning(true);
      }else{
        handleBatchInvoice();
      }
    } else {
      handleBatchInvoice();
    }
  };

  const handleBatchInvoice = async () => {
    setWarning(false);
    setDisableState(true)
    const toastId = loadingToast("Generating Batch Invoice...");
    setIsLoadingData(true);
    const checkAuditorUniq = new Set(
      data?.data?.data
        ?.map((dataItem: any) => {
          if (selectedPaymentList.includes(dataItem?.auditId)) {
            return dataItem?.userId;
          }
          return null; // Return null for non-matching items
        })
        .filter(Boolean) // Filter out null values
    );
    if (checkAuditorUniq.size == 1) {
      const response: any = await generateBulkInvoice(
        {
          auditorId: selectedPaymentList,
          data: data?.data?.data
            ?.map((data: any) => {
              if (selectedPaymentList.includes(data?.auditId)) {
                return data?.id;
              } else return false;
            })
            .filter(Boolean),
          orgId: userInfo?.organizationId,
          isSingle: false,
        },
        "ghc-contractor"
      );

      if (response) {
        successToast("Invoice Generated Successfully");

        if (response.data.s3Url.downloadUrl)
          window.open(response.data.s3Url.downloadUrl, "_blank");
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setIsLoadingData(false);
        closeToast(toastId);
      }
    } else {
      closeToast(toastId);
      setIsLoadingData(false);
      errorToast(
        "Please make sure all selected Contractor are the same in Invoice Summary generation"
      );
    }
    setDisableState(false)
  };

  const handleBulkUpdate = async () => {
    setDisableState(true)
    await updateBulkStatus({
      ids: selectedPaymentList,
      type: USER_ROLE.CONTRACTOR,
    })
      .then((res) => {
        if (res?.success) {
          setSelectedPaymentList([]);
          successToast("Status updated successfully");
          refetch();
          queryClient.invalidateQueries("all-accounting");
          setWaringPaid(false)
        }

      })
      .catch((err) => console.error(err)).finally(()=>setWaringPaid(false))
      setDisableState(false)
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
            ? `(${selectedPaymentList.length})`
            : `Bulk Update (${selectedPaymentList.length})`
        }
        icon={<FaRegEdit />}
        variant="outline-primary"
        onClick={()=>setWaringPaid(true)}
      />
    );
  };

  useEffect(() => {
    refetch();
  }, [filter, currentPage, sortType, limitPerPage, selectedContractor]);

  useEffect(() => {
    const getDifferentUsers = async () => {
      const allContractor = await getAllUsers({
        roleId: getUserRole(USER_ROLE.CONTRACTOR),
        orgId: userInfo?.organizationId || "",
      });
      setContractorList(allContractor);
    };
    getDifferentUsers();
  }, []);
  useEffect(() => {
    if (openFilterSidebar || userInfo?.roles?.[0]?.name !== "Contractor") {
      if (selectedContractor !== "") {
        setFilter({
          keyword: "",
          startDate: 0,
          endDate: 0,
          assignee:
            userInfo?.roles?.[0]?.name === "Contractor"
              ? (userInfo?.id as string)
              : "",
          userType: USER_ROLE.AUDITOR,
          paid: null,
          auditMode: "",
        });
        setSelectedContractor("");
      }
    }
  }, [openFilterSidebar]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center w-full gap-5">
        <div className="w-full">
          <div className="w-full flex justify-between items-center">
            <div className="flex">
              <Heading label={activeTab} type="h2" />
            </div>
            <div className="flex items-center justify-end gap-2 xs:gap-4">
              <div>
                <Button
                  icon={<GrPowerReset className="lg:text-lg font-bold" />}
                  label=""
                  size={isMobile ? "small" : "medium"}
                  variant="outline-gray"
                  backgroundColor="var(--color-white)"
                  onClick={() => {
                    setSortType("");
                    setFilter({
                      keyword: "",
                      startDate: 0,
                      endDate: 0,
                      assignee:
                        userInfo?.roles?.[0]?.name === "Contractor"
                          ? (userInfo?.id as string)
                          : "",
                      userType: USER_ROLE.CONTRACTOR,
                      paid: null,
                      auditMode: "",
                    });
                    setSelectedContractor("");
                  }}
                />
              </div>
              {!isTablet && userInfo?.roles?.[0]?.name !== "Contractor" && (
                <SBSelect
                  id="contractorId"
                  label=""

                  optionLabel = "Contractor"
                  value={selectedContractor || ""}
                  options={contractorList?.map((element: any) => {
                    return {
                      value: element.id,
                      label: `${element.firstName} ${element.lastName}`,
                    };
                  })}
                  onChange={(data: any) => {
                    setSelectedPaymentList([]);
                    setFilter({ ...filter, assignee: data });
                    setSelectedContractor(data);
                  }}
                />
              )}

              <div>
                <Button
                  size={isTablet ? "small" : "large"}
                  label={isMobile ? "" : "Filter"}
                  icon={<FaFilter className="md:text-sm" />}
                  onClick={() => setOpenFliterSidebar(true)}
                />
              </div>
              {isTablet && userInfo?.roles?.[0]?.name !== "Contractor" && (
                <AccountingMobileMenu
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Card className="flex flex-col">
        <div className="md:px-6 p-4 mt-4 justify-between items-center grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <input
              className={`${
                !formik.values.keyword && !data?.data?.data?.length
                  ? "cursor-not-allowed"
                  : ""
              }w-full form-input peer`}
              placeholder=""
              type="search"
              id="keyword"
              name="keyword"
              value={formik.values.keyword}
              disabled={!formik.values.keyword && !data?.data?.data?.length}
              onChange={(e) => {
                formik.setFieldTouched(e?.target?.name || e?.target?.id, true);
                formik.handleChange(e);
                setCurrentPage(0);
                const delayDebounceFn = setTimeout(() => {
                  formik.handleSubmit();
                }, 1000);
                return () => clearTimeout(delayDebounceFn);
              }}
            />
            <label
              htmlFor="user-search" // Associate the label with the input
              className="absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 bg-white"
            >
              Search Client
            </label>
          </div>
          <div></div>
          <div>
            <SBSelect
              id={`sortType`}
              label={""}
              optionLabel = "Sort"
              value={sortType}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              onChange={(data) => setSortType(data || "")}
              options={auditSortType.map((element) => {
                return {
                  value: element.value,
                  label: element.label,
                };
              })}
            />
          </div>
        </div>
        {selectedPaymentList.length > 0 && (
          <div className="hidden sm:flex items-center justify-end gap-3 p-4 pt-0">
            {userInfo?.roles?.[0]?.name === "Admin" && getBulkUpdateButton()}
            {!isLoadingData ? (
              <Button
                label={
                  isMobile
                    ? `(${selectedPaymentList.length})`
                    : `Batch Invoice (${selectedPaymentList.length})`
                }
                icon={<LiaFileInvoiceSolid className="text-lg" />}
                variant="outline-primary"
                onClick={checkPaymentList}
              />
            ) : (
              <LoadingButton
                label={isMobile ? "" : "Batch Invoice Generating"}
                variant="outline-primary"
              />
            )}
          </div>
        )}
        {isLoading ? (
          <LoadingSpinner />
        ) : data?.data?.data?.length > 0 ? (
          <GHCToContractorTable
            data={data?.data?.data || []}
            selectedPayment={selectedPaymentList}
            setSelectedPaymentList={setSelectedPaymentList}
            numberOfPage={data?.data?.totalPages}
            activePage={currentPage}
            setActivePage={(page) => setCurrentPage(page)}
            handleSort={handleSort}
            sortType={sortType}
            handleGenerateInvoice={(data) => !disable && handleGenerateInvoice(data)}
            handlePaymentSelect={handlePaymentSelect}
            numberOfRecords={data?.data?.totalItem}
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
                  label="No data to show"
                  type="h4"
                />
              </div>
            )}
          </div>
        )}
      </Card>
      <ConformationDialog
        open={waringPaid}
        processing={false}
        iconColor="#ffc107"
        variant={"warning"}
        buttonText="Confirm"
        message="Are you sure you want to update the status to paid?"
        onConfirm={handleBulkUpdate}
        setOpenModal={setWaringPaid}
      />
      <ConformationDialog
        open={warning}
        processing={false}
        iconColor="#ffc107"
        variant={"warning"}
        buttonText="Confirm"
        message="The chosen invoices are currently linked to an existing bulk invoice. Switch invoices from old invoice summary to new ?"
        onConfirm={handleBatchInvoice}
        setOpenModal={setWarning}
      />
      <FilterSidebarAccounting
        formik={formik}
        open={openFilterSidebar}
        close={() => {
          setOpenFliterSidebar(false);
        }}
        id={formik?.values?.userType}
      />
    </div>
  );
};

export default GHCToAuditor;
