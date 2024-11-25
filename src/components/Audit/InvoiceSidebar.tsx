"use client";
import { Sidebar } from "@/stories/Sidebar/Sidebar";
import React, { use, useEffect, useState } from "react";
import SBSelect from "@/stories/Select/Select";
import { useFormik } from "formik";
import * as Yup from "yup";
import SBInput from "@/stories/Input/Input";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/stories/Button/Button";
import { Label } from "@/stories/Label/Label";
import { FaEye, FaTimes } from "react-icons/fa";
import { useParams } from "next/navigation";
import {
  downloadInvoice,
  generateCombineInvoice,
  generateInvoice,
  generateInvoicePaymentSection,
} from "@/hooks/useInvoice";
import { USER_ROLE, getUserRole } from "@/types/roles";
import { getAllUsers } from "@/hooks/useUser";
import SBTextarea from "@/stories/Textarea/TextArea";
import { Checkbox } from "@material-tailwind/react";
import {
  closeToast,
  errorToast,
  loadingToast,
  successToast,
} from "@/hooks/toaster/useCustomToaster";
import { LoadingButton } from "@/stories/Loading-Button/LoadingButton";
import { DATE_FORMAT, PAID_BY } from "@/types/enums";
import { useQueryClient } from "react-query";
import { SBTabs } from "@/stories/Tabs/Tabs";
import { Table } from "@/stories/Table/Table";
import { dateTimeFormatter, fullNameFormatter } from "@/utils/CommonFunction";
import { useInvoiceHistory } from "@/hooks/useInvoiceHistory";
import LoadingSpinner from "../Common/LoadingSpinner";
import { Pagination } from "@/stories/Pagination/Pagination";

interface InvoiceSidebarProps {
  open: boolean;
  close: () => void;
  data?: any;
}

const InvoiceSidebar = ({ open, close, data }: InvoiceSidebarProps) => {
  const { userInfo } = useAuth();
  const queryClient = useQueryClient();
  const [emailsInput, setEmailsInput] = useState("");
  const clientId: any = useParams();
  const [auditorList, setAuditorList] = useState<any>([]);
  const [contractorList, setContractorList] = useState<any>([]);
  const [SOList, setSOList] = useState<any>([]);
  const [useDefaultBody, setDefualtBody] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [show, setShow] = useState<String>("INVOICE");

  const handleDownloadAndSendEmail = async (formData: any) => {
    setIsLoading(true);

    if (formData.actionType === "email-invoice") {
      if (formik.values.generateInvoce == "Both") {
        return await generateCombineInvoice({
          data,
          formData,
          orgId: userInfo?.organizationId,
        } as any)
          .then((res: any) => {
            if (res?.s3Url.downloadUrl)
              window.open(res?.s3Url.downloadUrl, "_blank");
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            successToast("Invoice sent successfully");
            setIsLoading(false);
            close();
          })
          .catch((e: any) => {
            errorToast("Failed to send invoice");
            setIsLoading(false);
          });
      }

      setIsLoading(true);
      const pdfBuffer = generateInvoice({
        data,
        formData,
        orgId: userInfo?.organizationId,
      } as any)
        .then(() => {
          successToast("Invoice sent successfully");
          setIsLoading(false);
          close();
        })
        .catch((e) => {
          errorToast("Failed to send invoice");
          setIsLoading(false);
        });
    }

    if (formData.actionType === "download-invoice") {
      if (formik.values.generateInvoce == "Both") {
        return await generateCombineInvoice({
          data,
          formData,
          orgId: userInfo?.organizationId,
        } as any)
          .then((res: any) => {
            if (res?.s3Url.downloadUrl)
              window.open(res?.s3Url.downloadUrl, "_blank");
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            successToast("Invoice sent successfully");
            setIsLoading(false);
            close();
          })
          .catch((e: any) => {
            errorToast("Failed to send invoice");
            setIsLoading(false);
          });
      }
      setIsLoading(true);
      const res: any = await downloadInvoice(clientId?.id as string, {
        data,
        formData,
        orgId: userInfo?.organizationId,
      });

      await Promise.all(
        res?.s3Url.map(({ downloadUrl }: any) => {
          if (downloadUrl) window.open(downloadUrl, "_blank");
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        })
      );
      res && setIsLoading(false);
    }
    if (formData.actionType === "both") {
      if (formik.values.generateInvoce == "Both") {
        return await generateCombineInvoice({
          data,
          formData,
          orgId: userInfo?.organizationId,
        } as any)
          .then((res: any) => {
            if (res?.s3Url.downloadUrl)
              window.open(res?.s3Url.downloadUrl, "_blank");
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            successToast("Invoice sent successfully");
            setIsLoading(false);
            close();
          })
          .catch((e: any) => {
            errorToast("Failed to send invoice");
            setIsLoading(false);
          });
      }
      setIsLoading(true);
      const pdfBuffer = generateInvoice({
        data,
        formData,
        orgId: userInfo?.organizationId,
      } as any)
        .then((res) => {
          res?.s3Url.map(({ downloadUrl }: any) => {
            if (downloadUrl) window.open(downloadUrl, "_blank");
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          });
          successToast("Invoice sent successfully");
          setIsLoading(false);
          close();
        })
        .catch((e) => {
          errorToast("Failed to send invoice");
          setIsLoading(false);
        });
    }

    // setIsLoading(false);
  };

  const formik = useFormik({
    validateOnChange: true,
    initialValues: {
      actionType: "email-invoice",
      emails: [data?.email].filter(Boolean) || [],
      invoiceTo: "",
      invoiceFrom: "",
      startDate: null,
      endDate: null,
      subject: "",
      auditorId: "",
      contractorId: "",
      body: "",
      generateInvoce:
        data?.auditType == "dual"
          ? "Both"
          : data?.auditMode?.toUpperCase() || "E",
      status: [],
    },
    validationSchema: Yup.object({
      subject: Yup.string().max(75, "Maximum subject length is 70").trim(),
    }),
    onSubmit: handleDownloadAndSendEmail,
  });
  useEffect(() => {
    formik.setFieldValue("generateInvoce", data?.auditMode?.toUpperCase());
  }, [data]);

  useEffect(() => {
    const getDifferentUsers = async () => {
      const allAuditor = await getAllUsers({
        roleId: getUserRole(USER_ROLE.AUDITOR),
        orgId: userInfo?.organizationId || "",
      });
      setAuditorList(allAuditor);

      const allContractor = await getAllUsers({
        roleId: getUserRole(USER_ROLE.CONTRACTOR),
        orgId: userInfo?.organizationId || "",
      });
      setContractorList(allContractor);

      const allSO = await getAllUsers({
        roleId: getUserRole(USER_ROLE.SO),
        orgId: userInfo?.organizationId || "",
      });
      setSOList(allSO);
    };
    queryClient.invalidateQueries("audits");
    getDifferentUsers();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "NumpadEnter") {
      event.preventDefault();
      const trimmedInput = emailsInput.trim().toLocaleLowerCase();
      if (trimmedInput !== "" && !formik.values.emails.includes(trimmedInput)) {
        const emailList = [...formik.values.emails, trimmedInput];
        formik.setFieldValue("emails", emailList);
        setEmailsInput("");
      }
    }
  };

  const handleRemoveEmail = (index: number) => {
    const updatedEmails = [...formik.values.emails];
    updatedEmails.splice(index, 1);
    formik.setFieldValue("emails", updatedEmails);
  };

  const closeSidebar = () => {
    // setEmailsInput("");

    formik.resetForm();
    setIsLoading(false);
    close();
  };

  const autoGrow = (event: any) => {
    const element = event;
    element.style.height = "5px";
    element.style.height = element.scrollHeight + "px";
  };

  useEffect(() => {
    if (useDefaultBody) {
      formik.setFieldValue(
        "body",
        [
          "I hope this email finds you well.\n\n",
          "We writing to inform you that the invoice for auditing has been generated and is attached to this email for your reference. Please review the attached invoice at your earliest convenience.\n\n",
          "If you have any questions or concerns regarding the invoice or the services/products provided, please feel free to reach out to me directly. I'll be more than happy to assist you in any way I can.\n\n",
          "Thank you for your continued business and support. We value our partnership with you and look forward to serving you in the future.\n\n",
          "Best regards\n",
          "Green Home Consulting",
        ].join("")
      );
      const e = document.getElementById("body");
      if (e) {
        e.style.height = 380 + "px";
      }
    } else {
      formik.setFieldValue("body", "");
      const e = document.getElementById("body");
      if (e) {
        e.style.height = 100 + "px";
      }
    }
  }, [useDefaultBody]);

  useEffect(() => {
    formik.setFieldValue("body", "");
    if (data?.email) {
      formik.setFieldValue("emails", [
        ...formik?.values?.emails.filter((d) => d !== data?.email),
        data?.email,
      ]);
    }
  }, [open]);

  useEffect(() => {
    setDefualtBody(false);
  }, [open]);

  return (
    <Sidebar
      open={open}
      sidebarWidth="max-w-[45rem]"
      close={() => closeSidebar()}
      title={"Invoice"}
      headerClassName={"!border-t-8"}
      contentClassName="px-0 pb-0 pt-4"
    >
      {data?.eCost?.auditCost > 0 || data?.dCost?.auditCost > 0 ? (
        <form
          className="flex h-full flex-col gap-5"
          onSubmit={formik.handleSubmit}
        >
          <div className="overflow-auto h-full mb-2  space-y-6 px-4">
            <div className=" flex ">
              {/* <div className="mt-4 w-full">
                <div className="mt-0">
                  <div className="border border-colorLighter flex rounded-md cursor-pointer">
                    <div
                      className={`border-r border-colorLighter flex-1 px-4 py-[10px] text-center text-sm  ${show === "INVOICE" ? "bg-themePrimary text-colorWhite rounded-l-[5px]" : ""}`}
                      onClick={() => setShow("INVOICE")}
                    >
                      Invoice
                    </div>

                    <div
                      className={`px-4 py-[10px] flex-1 text-center text-sm ${show === "INVOICE_HIS" ? "bg-themePrimary text-colorWhite rounded-r-[5px]" : ""}`}
                      onClick={() => setShow("INVOICE_HIS")}
                    >
                      History
                    </div>
                  </div>
                </div>
              </div> */}
              <SBTabs
                activeTab={show as any}
                className="!w-full border rounded-normal"
                tabsContainerClass="!w-full  nav-tab  "
                tabCallback={setShow}
                tabList={[
                  { label: "Invoice", value: "INVOICE" },
                  { label: "History", value: "INVOICE_HIS" },
                ]}
                tabClassName=" !w-full"
                tabBody={null}
              />
            </div>

            {show == "INVOICE" ? (
              <>
                <div className="flex gap-4">
                  {(data.eCost?.auditCost > 0 || data.eCost?.auditCost > 0) &&
                    data?.auditType == "dual" && (
                      <div className="mt-4 w-full">
                        <div className="mt-0">
                          <div className="mb-1">
                            <Label size="extra-small" label="Invoice for" />
                          </div>
                          <div className="border border-colorLighter flex rounded-md cursor-pointer">
                            {+data.eCost?.auditCost > 0 && (
                              <div
                                className={`border-r border-colorLighter flex-1 px-4 py-[10px] text-center text-sm  ${formik.values.generateInvoce === "E" ? "bg-themePrimary text-colorWhite rounded-l-[5px]" : ""}`}
                                onClick={() =>
                                  formik.setFieldValue(`generateInvoce`, "E")
                                }
                              >
                                E Audit
                              </div>
                            )}
                            {+data.dCost?.auditCost > 0 && (
                              <div
                                className={`px-4 border-r  py-[10px] flex-1 text-center text-sm ${formik.values.generateInvoce === "D" ? "bg-themePrimary text-colorWhite " : ""}`}
                                onClick={() =>
                                  formik.setFieldValue(`generateInvoce`, "D")
                                }
                              >
                                D Audit
                              </div>
                            )}
                            {+data.dCost?.auditCost > 0 &&
                              +data.eCost?.auditCost > 0 &&
                              data?.dCost?.paidBy == PAID_BY.HOMEOWNER &&
                              data?.eCost?.paidBy == PAID_BY.HOMEOWNER && (
                                <div
                                  className={`px-4 py-[10px] flex-1 text-center text-sm ${formik.values.generateInvoce === "Both" ? "bg-themePrimary text-colorWhite rounded-r-[5px]" : ""}`}
                                  onClick={() =>
                                    formik.setFieldValue(
                                      `generateInvoce`,
                                      "Both"
                                    )
                                  }
                                >
                                  Both
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    )}
                </div>
                <div className=" flex gap-4">
                  <div className="mt-4 w-full">
                    <SBSelect
                      id="actionType"
                      label={"Action Type"}
                      value={formik.values.actionType}
                      hideOptionalOption={true}
                      options={[
                        { value: "email-invoice", label: "Email Invoice" },
                        {
                          value: "download-invoice",
                          label: "Download Invoice",
                        },
                        { value: "both", label: "Both" },
                      ]}
                      onChange={(data) => {
                        formik.setFieldValue("actionType", data);
                      }}
                    />
                  </div>
                </div>
                {/* <div className=" flex gap-4">
            <div className=" w-full">
              <SBSelect
                id="invoiceFrom"
                label={"Invoice From"}
                value={formik.values.invoiceFrom}
                hideOptionalOption={true}
                options={[
                  { value: "GHC", label: "GHC" },
                  { value: "Auditor", label: "Auditor" },
                ]}
                onChange={(data) => {
                  formik.setFieldValue("invoiceFrom", data);
                }}
              />
            </div>
            <div className="w-full">
              <SBSelect
                id="invoiceTo"
                label={"Invoice To"}
                value={formik.values.invoiceTo}
                hideOptionalOption={true}
                options={[
                  { value: "homeowner", label: "Home Owner" },
                  { value: "Contractor", label: "Contractor" },
                  { value: "SO", label: "SO" },
                ]}
                onChange={(data) => {
                  formik.setFieldValue("invoiceTo", data);
                }}
              />
            </div>
          </div> */}
                {/* <div className=" flex gap-4">
            <div className="w-full">
              <SBInput
                id="startDate"
                name="startDate"
                label="Start Date"
                inputType="date"
                value={formik.values.startDate as any}
                onChange={(e) =>
                  formik.setFieldValue(
                    `startDate`,
                    Number(moment(e.target.value))
                  )
                }
              />
            </div>
            <div className="w-full">
              <SBInput
                id="endDate"
                name="endDate"
                label="End Date"
                inputType="date"
                value={formik.values.endDate as any}
                onChange={(e) =>
                  formik.setFieldValue(
                    `endDate`,
                    Number(moment(e.target.value))
                  )
                }
              />
            </div>
          </div> */}
                {/* <div className="flex gap-4">
            <div className="w-full">
              <SBSelect
                id={`auditorId`}
                label={"Auditor"}
                value={formik.values.auditorId}
                options={auditorList?.map((element: any) => {
                  return {
                    value: element.id,
                    label: `${element.firstName} ${element.lastName}`,
                  };
                })}
                onChange={(data) => formik.setFieldValue(`auditorId`, data)}
              />
            </div>
            <div className="w-full">
              <SBSelect
                id={`contractorId`}
                label={"Contractor"}
                value={formik.values.contractorId}
                options={contractorList?.map((element: any) => {
                  return {
                    value: element.id,
                    label: `${element.firstName} ${element.lastName}`,
                    image: element?.imgUrl || "",
                  };
                })}
                onChange={(data) => formik.setFieldValue(`contractorId`, data)}
              />
            </div>
          </div> */}
                {/* 
          <div className="flex flex-wrap gap-4 w-full ">
            {AUDIT_STATUS.map((element: string) => {
              return (
                <div
                  className="flex cursor-pointer"
                  onClick={() => {
                    if (formik?.values?.status?.includes(element as never)) {
                      formik.setFieldValue("status", [
                        ...formik.values.status.filter(
                          (ele) => ele !== element
                        ),
                      ]);
                    } else {
                      formik.values.status.push(element as never);
                      formik.setFieldValue("status", [...formik.values.status]);
                    }
                  }}
                >
                  <Chip
                    style={{
                      backgroundColor: formik.values.status.includes(
                        element as never
                      )
                        ? STATUS_BG_COLOR[element]
                        : "#fff",
                      color: formik.values.status.includes(element as never)
                        ? STATUS_TEXT_COLOR[element]
                        : "#000",
                    }}
                    className={` text-center border`}
                    value={element}
                  />
                </div>
              );
            })}
          </div> */}

                {formik.values.actionType !== "download-invoice" && (
                  <>
                    <div>
                      <SBInput
                        id="emails"
                        name="emails"
                        label="Recipient"
                        inputType="email"
                        value={emailsInput}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => {
                          setEmailsInput(e.target.value);
                        }}
                        error={formik.values.emails.includes(
                          emailsInput.trim().toLocaleLowerCase()
                        )}
                        touched={formik.values.emails.includes(
                          emailsInput.trim().toLocaleLowerCase()
                        )}
                        errorMessage="Email cannot be repeated"
                      />
                      {!formik.values.emails.includes(
                        emailsInput.trim().toLocaleLowerCase()
                      ) && (
                        <Label
                          className="font-normal text-slate-500 ml-1 text-colorLight"
                          label="Please press 'enter' after typing to add recipient email"
                          size="small"
                        />
                      )}
                      {formik.touched.emails &&
                        Boolean(formik.errors.emails) && (
                          <span className="flex items-center font-normal tracking-wide text-colorDanger text-xs mt-1 ml-1">
                            {Boolean(formik?.touched?.emails) &&
                              (formik?.errors?.emails as string)}
                          </span>
                        )}
                      <div className="flex flex-wrap gap-2 w-full my-2 mb-4">
                        {formik.values.emails.map(
                          (elem: string, index: number) => {
                            return (
                              <div
                                key={`recipient-email-${index}`}
                                className="flex items-center bg-themePrimary text-white gap-2 px-3 py-1 rounded-lg w-fit max-w-full"
                              >
                                <Label
                                  label={elem}
                                  className="truncate !whitespace-nowrap grow"
                                />
                                <FaTimes
                                  onClick={() => handleRemoveEmail(index)}
                                  size={15}
                                  className="flex-none"
                                />
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                    <div>
                      <SBInput
                        id="subject"
                        name="subject"
                        label="Subject"
                        value={formik.values.subject}
                        onChange={(e) => {
                          formik.setFieldTouched(
                            e?.target?.name || e?.target?.id,
                            true
                          );
                          formik.handleChange(e);
                        }}
                      />
                    </div>
                    <div>
                      <SBTextarea
                        id="body"
                        name="body"
                        label="Body"
                        onInput={(e) => autoGrow(e.target)}
                        inputClassName="resize-vertical overflow-hidden"
                        value={formik.values.body}
                        onChange={(e) => {
                          formik.setFieldTouched(
                            e?.target?.name || e?.target?.id,
                            true
                          );
                          formik.handleChange(e);
                        }}
                      />

                      <Checkbox
                        className="text-colorBlack"
                        id="bodyContent"
                        name="bodyContent"
                        label="Insert Default Body Content"
                        labelProps={{
                          className: "text-colorBlack text-sm font-normal",
                        }}
                        checked={useDefaultBody}
                        onChange={(e) =>
                          setDefualtBody((data: boolean) => !data)
                        }
                      />
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div>
                  {/* <div className="flex gap-4 mb-4">
              {(data.eCost?.auditCost > 0 || data.eCost?.auditCost > 0) &&
                data?.auditType == "dual" && (
                  <div className="mt-4 w-full">
                    <div className="mt-0">
                      <div className="mb-1">
                        <Label size="extra-small" label="Invoice for" />
                      </div>
                      <div className="border border-colorLighter flex rounded-md cursor-pointer">
                        {+data.eCost?.auditCost > 0 && (
                          <div
                            className={`border-r border-colorLighter flex-1 px-4 py-[10px] text-center text-sm  ${formik.values.generateInvoce === "E" ? "bg-themePrimary text-colorWhite rounded-l-[5px]" : ""}`}
                            onClick={() =>
                              formik.setFieldValue(`generateInvoce`, "E")
                            }
                          >
                            E Audit
                          </div>
                        )}
                        {+data.dCost?.auditCost > 0 && (
                          <div
                            className={`px-4 border-r  py-[10px] flex-1 text-center text-sm ${formik.values.generateInvoce === "D" ? "bg-themePrimary text-colorWhite " : ""}`}
                            onClick={() =>
                              formik.setFieldValue(`generateInvoce`, "D")
                            }
                          >
                            D Audit
                          </div>
                        )}
                        {+data.dCost?.auditCost > 0 &&
                          +data.eCost?.auditCost > 0 &&
                          data?.dCost?.paidBy == PAID_BY.HOMEOWNER &&
                          data?.eCost?.paidBy == PAID_BY.HOMEOWNER && (
                            <div
                              className={`px-4 py-[10px] flex-1 text-center text-sm ${formik.values.generateInvoce === "Both" ? "bg-themePrimary text-colorWhite rounded-r-[5px]" : ""}`}
                              onClick={() =>
                                formik.setFieldValue(`generateInvoce`, "Both")
                              }
                            >
                              Both
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                )}
            </div> */}
                  <InvoiceHistory
                    userInfo={userInfo}
                    for={formik.values.generateInvoce}
                  ></InvoiceHistory>
                </div>
              </>
            )}
          </div>
          <div
            className={"flex-none flex gap-2 bg-white px-4 py-3 justify-end"}
            style={{ boxShadow: "0px -1px 0px 0px rgba(0, 0, 0, 0.15)" }}
          >
            <Button
              label="Cancel"
              size="large"
              onClick={() => closeSidebar()}
              variant="outline-gray"
              className="hover:bg-colorLightest"
            />
            {isLoading ? (
              <LoadingButton
                label={
                  formik.values?.actionType === "email-invoice"
                    ? "Sending"
                    : "Downloading"
                }
              />
            ) : (
              <Button
                label={
                  formik.values?.actionType === "email-invoice"
                    ? "Send"
                    : formik.values?.actionType === "download-invoice"
                      ? "Download"
                      : "Send & Download"
                }
                size="large"
                type="submit"
                className="hover:bg-hoverPrimary"
              />
            )}
          </div>
        </form>
      ) : (
        <>
          <div className="flex text justify-center items-center  bold">
            None of the audit amounts exceed 0 !
          </div>
        </>
      )}
    </Sidebar>
  );
};

export default InvoiceSidebar;

const InvoiceHistory = ({ for: generateCombineInvoice, userInfo }: any) => {
  const clientId: any = useParams();
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [limitPerPage, setLimitPerPage] = useState<number>(10);

  const { data, isLoading, refetch } = useInvoiceHistory({
    clientId: clientId?.id,
    pageSize: limitPerPage,
    page: currentPage,
  });
  // const menuItem:any =history.data..filter(Boolean);

  const handleDownloadInvoice = async (url: any) => {
    const toastId = loadingToast("Fetching Invoice...");
    if (url) {
      closeToast(toastId);
      window.open(url);
    }
    closeToast(toastId);
  };

  const auditTableColumn = [
    {
      label: "Issued By",
      value: "issudedBy",
      className: "text-left",
    },
    {
      label: "created At",
      value: "createdAt",
      className: "text-left",
    },
    {
      label: "Action",
      value: "action",
      className: "text-right",
    },
  ];

  useEffect(() => {
    if (data?.data?.data) {
      const newData = data.data.data.map((data: any) => {
        return {
          issudedBy: (
            <Label
              className="whitespace-nowrap w-full cursor-pointer"
              label={fullNameFormatter(
                data.creator.firstName,
                data.creator.lastName
              )}
            />
          ),

          createdAt: (
            <div className="flex flex-col whitespace-nowrap">
              <Label
                className="whitespace-nowrap w-full"
                label={dateTimeFormatter(DATE_FORMAT.DATE, data?.createdAt)}
              />
            </div>
          ),

          action: (
            <div className="flex justify-end w-full">
              {" "}
              <Button
                label=""
                icon={<FaEye color="var(--color-primary)" />}
                onClick={() => handleDownloadInvoice(data?.invoiceURL)}
                className="!bg-colorLighter rounded-normal justify-self-end"
              >
                {" "}
              </Button>{" "}
            </div>
          ),
        };
      });
      setHistory(newData);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [limitPerPage, currentPage]);

  return (
    <>
      <div className="w-full flex  flex-col  ">
        {isLoading ? (
          <>
            <LoadingSpinner></LoadingSpinner>
          </>
        ) : (
          <Table
            data={history}
            columns={auditTableColumn}
            pagination={{
              activePage: currentPage,
              setActivePage: setCurrentPage,
              numberOfPage: data?.data.totalPages || 1,
              numberOfRecords: data?.data.totalItem || 5,
              itemsPerPage: limitPerPage,
              setItemsPerPage: setLimitPerPage,
              hidePagination: false,
            }}
          />
        )}
      </div>
    </>
  );
};
