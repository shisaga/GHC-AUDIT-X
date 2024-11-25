"use client";
import { Button } from "@/stories/Button/Button";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaRegFileAlt, FaRegImages, FaRegUser } from "react-icons/fa";
import { Heading } from "@/stories/Heading/Heading";
import { Card } from "@/stories/Card/Card";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  formatPhoneNumber,
  removeSpecialCharacters,
} from "@/utils/CommonFunction";
import SBInput from "@/stories/Input/Input";
import { LoadingButton } from "@/stories/Loading-Button/LoadingButton";
import {
  getAllAuditData,
  getSpecificAudit,
  useAddAudit,
  useChangeHistory,
  useUpdateAudit,
} from "@/hooks/useAudit";
import { errorToast, successToast } from "@/hooks/toaster/useCustomToaster";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import LoadingSpinner from "@/components/Common/LoadingSpinner";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import Dpayment from "./Dpayment";
import Dcost from "./Dcost";
import Daudit from "./Daudit";
import axios from "axios";
import AddressInfoDetail from "../Common/AddressInfoDetail";
import { AuditFormData } from "@/types/user";
import { LEADTYPE, PAID_BY } from "@/types/enums";
import CommentSidebar from "./CommentSidebar";
import MoreMenu, { MenuItemProps } from "../Common/MoreMenu";
import { MdOutlineComment } from "react-icons/md";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { Label } from "@/stories/Label/Label";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import InvoiceSidebar from "./InvoiceSidebar";
import { LuHistory } from "react-icons/lu";
import ChangeHistorySidebar from "./ChangeHistorySidebar";
import SBTextarea from "@/stories/Textarea/TextArea";
import { useMediaQuery } from "react-responsive";
import moment from "moment";
import ReportSidebar from "./ReportSidebar";
import { ImInfo } from "react-icons/im";
import Notes from "./Notes";
import { useQueryClient } from "react-query";
import SBSelect from "@/stories/Select/Select";

interface IconsProps {
  open: boolean;
}
interface LastUpdate {
  userName: string;
  updatedAt: string | Date;
  userId: string;
}

const CreateOrEditAudit = () => {
  const [open, setOpen] = useState<any>({
    address: true,
    dAudit: false,
    dCost: false,
    dPayment: false,
  });
  const params = useParams();
  const { userInfo } = useAuth();
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery({ maxWidth: 480 });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAdding, addAudit } = useAddAudit();
  const { isUpdating, updateAudit } = useUpdateAudit();
  const pathname = usePathname();
  const router = useRouter();

  const editMode = pathname.includes("edit");
  const {
    data: historyList,
    isFetching,
    refetch: historyRefeth,
  }: any = useChangeHistory(params?.id as string);

  const [cordinates, setCordinates] = useState({ lat: 0, lng: 0 });
  const [refecth, setRefetch] = useState(false);
  const [ladingMap, setLoadingMap] = useState<boolean>(false);
  const [openCommentSidebar, setOpenCommentSidebar] = useState<boolean>(false);
  const [openHistorySidebar, setOpenHistorySidebar] = useState<boolean>(false);
  const [openInvoiceSidebar, setOpenInvoiceSidebar] = useState<boolean>(false);
  const [selectedContrator, setSelectedContrator] = useState<any>({
    e: "",
    d: "",
  });
  const [openReportSidebar, setOpenReportSidebar] = useState<boolean>(false);
  const [specificUserData, setSpecificUserData] = useState<AuditFormData>();
  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [checkAuditNo, setCheckAuditNo] = useState<any>([]);

  const [auditModeType, setAuditModeType] = useState({
    auditMode: "",
    auditType: pathname.includes("single") ? "single" : "dual",
  });
  const [lastUpdated, setLastUpdated] = useState<LastUpdate>({
    userName: "",
    updatedAt: new Date(),
    userId: "",
  });

  const converted = pathname.includes("converted");
  const handleNext = () => setActiveStep((cur) => cur + 1);

  const handlePrev = () => setActiveStep((cur) => cur - 1);
  const isSingle = pathname.includes("single");

  let cont = 0;
  const handleGeocode = (addressString: string) => {
    setLoadingMap(true);

    axios
      .get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          address: addressString,
          key: "AIzaSyBFdyonn45zixfNRgSE0jlbBFjwWr4Zo8Q", // Replace with your actual Google Maps API key
        },
      })
      .then((response) => {
        const { results } = response.data;
        if (cont < 4) {
          cont++;
          results.length === 0 && handleGeocode(addressString);
        }
        if (results.length > 0) {
          const data = results[0].geometry.location;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          setCordinates({ ...data });
          cont = 0;
          setLoadingMap(false);
        } else {
          console.error("No results found for the location.");
        }
      })
      .catch((error) => {
        console.error("Error fetching geocoding data:", error);
      })
      .finally(() => {
        setLoadingMap(false);
      });
  };

  const handleAddAudit = async (auditData: AuditFormData) => {
    await addAudit(auditData)
      .then((result: any) => {
        if (result?.success) {
          successToast(result?.message);
          router.push("/audits");
          // formik.resetForm();
        }
      })
      .catch((err: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        errorToast(err);
      });
  };
  const handleUpdateAudit = async (formData: AuditFormData) => {
    await updateAudit({ ...formData, id: params?.id as string })
      .then((result) => {
        successToast(`Audit Updated Successfully`);
        historyRefeth();
        // router.push("/audits");
        queryClient.invalidateQueries("audits");
        setRefetch((d) => !d);
      })
      .catch((err) => {
        errorToast(err?.response?.data?.message as string);
      });
  };

  const checkingContractor: any = (type: string) => {
    // Your function logic here
    return activeStep === 1 && selectedContrator[type] === "CONTRACTOR"
      ? {
          [auditModeType.auditType === "dual"
            ? "contractorId"
            : auditModeType.auditMode.toLocaleLowerCase() === type
              ? "contractorId"
              : ""]: Yup.string().required("Contractor is required"),
        }
      : {};
  };
  const formik = useFormik({
    validateOnChange: true,
    validateOnMount: true,
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      mobile: "",
      calculatedSum: "",
      unit: "",
      streetAddress: "",
      city: "",
      province: "Ontario",
      country: "Canada",
      postalCode: "",
      isMailingAddressSame: true,
      mailingAddress: {
        unit: "",
        streetAddress: "",
        city: "",
        province: "Ontario",
        country: "Canada",
        postalCode: "",
      },
      notes: {
        note: "",
        files: [],
      },
      organizationId: Number(userInfo?.organizationId) || 0,
      creatorId: userInfo?.id || "",
      preferredContactMethod: "",
      auditMode: "D",
      auditType: isSingle ? "single" : "dual",
      dAuditId: "",
      dAudit: {
        priority: "2",
        audit: "",
        leadType:
          userInfo?.roles?.[0]?.name === "Auditor" ? LEADTYPE.EA : LEADTYPE.GHC,
        auditStatus: "In-Progress",
        auditDate: null,
        startTime: null,
        endTime: null,
        application: "",
        auditorId:
          userInfo?.roles?.[0]?.name === "Auditor"
            ? Number(userInfo?.id)
            : null,
        contractorId: null,
        SOId: null,
      },
      dCost: {
        auditCost: 0,
        paidBy: "",
      },
      dPayment: {
        paid: false,
        invoiceSent: false,
        EABalanceCleared: false,
        contractorBalanceCleared: false,
        SOBalanceCleared: false,
        reportSent: false,
        paymentType: "",
        paymentDate: null,
      },
      dSONotes: "",
      eAuditId: "",
      eAudit: {
        priority: "2",
        audit: "",
        leadType:
          userInfo?.roles?.[0]?.name === "Auditor" ? LEADTYPE.EA : LEADTYPE.GHC,
        auditStatus: "In-Progress",
        auditDate: null,
        startTime: null,
        endTime: null,
        application: "",
        auditorId:
          userInfo?.roles?.[0]?.name === "Auditor"
            ? Number(userInfo?.id)
            : null,
        contractorId: null,
        SOId: null,
      },
      eCost: {
        auditCost: 0,
        paidBy: "",
      },
      ePayment: {
        paid: false,
        invoiceSent: false,
        EABalanceCleared: false,
        contractorBalanceCleared: false,
        SOBalanceCleared: false,
        reportSent: false,
        paymentType: "",
        paymentDate: null,
      },
      eSONotes: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .email("Email is not valid")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Email is not valid"
        )
        .max(50, "Maximum email length is 50")
        .required("Email is required"),
      firstName: Yup.string()
        .matches(/^[a-zA-Z\s]+$/, "First name must contain only letters")
        .min(3, "Mininum first name length is 3")
        .max(15, "Maximum first name length is 15")
        .trim(),
      lastName: Yup.string()
        .matches(/^[a-zA-Z\s]+$/, "First name must contain only letters")
        .min(3, "Mininum last name length is 3")
        .max(15, "Maximum last name length is 15")
        .trim(),
      mobile: Yup.string()
        .trim()
        .matches(/^\d{10}$/, "Maximum Phone number length is 10"),
      province: Yup.string().trim().required("Province is required"),
      streetAddress: Yup.string().trim().required("Street address is required"),
      country: Yup.string().trim().required("Country is required"),
      city: Yup.string().trim().required("City is required"),
      eSONotes:Yup.string().trim().max(2500,"Max  2500 Character are allowed"),
      dSONotes:Yup.string().trim().max(2500,"Max  2500 Character are allowed"),
      postalCode: Yup.string()
        .trim()
        .min(6, "Postal code length must be 6 digit")
        .required("Postal code is required"),

      mailingAddress: Yup.object().shape({
        province: Yup.string().trim().required("Province is required"),
        streetAddress: Yup.string()
          .trim()
          .required("Street address is required"),
        country: Yup.string().trim().required("Country is required"),
        city: Yup.string().trim().required("City is required"),
        postalCode: Yup.string()
          .trim()
          .min(6, "Postal code length must be 6 digit")
          .required("Postal code is required"),
      }),
      dAudit: Yup.object().shape({
        application:Yup.string().trim().max(25,"Maximum 100 character are allowed"),
        audit: Yup.string()
          .when("auditMode", (auditMode: any, schema: any) => {
            if (
              activeStep === 1 &&
              auditModeType.auditType === "single" &&
              auditModeType.auditMode === "D"
            )
              return schema
                .matches(/^[0-9]+$/, "Only numeric values are allowed")
                .min(5, "Audit number must be 5 digits")
                .required("Audit number is required");

            if (activeStep === 1 && auditModeType.auditType === "dual")
              return schema
                .matches(/^[0-9]+$/, "Only numeric values are allowed")
                .min(5, "Audit number must be 5 digits")
                .required("Audit number is required");
          })
          .test("", "Audit number must be unique", (values) => {
            if (
              formik.values?.dAudit?.auditorId &&
              checkAuditNo?.data?.length
            ) {
              let data: any = checkAuditNo?.data;

              if (editMode) {
                data = data?.filter((a: any) => a?.clientId !== +params?.id);
              }
              return data
                ?.filter(
                  (a: any) => a?.auditorId == formik.values?.dAudit?.auditorId
                )
                .filter((c: any) => c?.id !== formik.values?.dAuditId)
                .filter((b: any) => b?.audit == +(values as any))?.length > 0
                ? false
                : true;
            } else {
              return true;
            }
          }),
        ...(() => {
          return activeStep == 1 &&
            (auditModeType.auditType === "dual"
              ? "auditorId"
              : auditModeType.auditMode === "D"
                ? "auditorId"
                : false)
            ? {
                [auditModeType.auditType === "dual"
                  ? "auditorId"
                  : auditModeType.auditMode === "D"
                    ? "auditorId"
                    : ""]: Yup.string().required("Auditor is required"),
              }
            : {};
        })(),
        ...checkingContractor("d"),
      }),

      eAudit: Yup.object().shape({
        application:Yup.string().trim().max(25,"Maximum 100 character are allowed"),
        audit: Yup.string()
          .when("auditMode", (auditMode: any, schema: any) => {
            if (
              activeStep === 1 &&
              auditModeType.auditType === "single" &&
              auditModeType.auditMode === "E"
            )
              return schema
                .matches(/^[0-9]+$/, "Only numeric values are allowed")
                .min(5, "Audit number must be 5 digits")
                .required("Audit number is required");

            if (activeStep === 1 && auditModeType.auditType === "dual")
              return schema
                .matches(/^[0-9]+$/, "Only numeric values are allowed")
                .min(5, "Audit number must be 5 digits")
                .required("Audit number is required");
          })
          .test("", "Audit number must be unique", (values) => {
            if (formik.values.eAudit?.auditorId && checkAuditNo?.data?.length) {
              let data: any = checkAuditNo?.data;

              if (editMode) {
                data = data?.filter((a: any) => a?.clientId !== +params?.id);
              }
              return data
                ?.filter(
                  (a: any) => a.auditorId == formik.values.eAudit?.auditorId
                )
                .filter((c: any) => c?.id !== formik?.values?.eAuditId)
                .filter((b: any) => b?.audit == +(values as any))?.length > 0
                ? false
                : true;
            } else {
              return true;
            }
          }),

        ...(() => {
          return activeStep == 1 &&
            (auditModeType.auditType === "dual"
              ? "auditorId"
              : auditModeType.auditMode === "E"
                ? "auditorId"
                : false)
            ? {
                [auditModeType.auditType === "dual"
                  ? "auditorId"
                  : auditModeType.auditMode === "E"
                    ? "auditorId"
                    : ""]: Yup.string().required("Auditor is required"),
              }
            : {};
        })(),

        ...checkingContractor("e"),
      }),
    }),

    onSubmit: editMode
      ? handleUpdateAudit
      : activeStep === 1
        ? handleAddAudit
        : handleNext,
  });

  useEffect(() => {
    fetchAuditList();
  }, []);

  useEffect(() => {
    if (formik.values.dCost?.paidBy) {
      setSelectedContrator({
        ...selectedContrator,
        d: formik.values.dCost?.paidBy,
      });
    }
    if (formik.values.eCost?.paidBy) {
      setSelectedContrator({
        ...selectedContrator,
        e: formik.values.eCost?.paidBy,
      });
    }
  }, [formik.values.dCost?.paidBy, formik.values.eCost?.paidBy]);

  const fetchAuditList = async () => {
    const data = await getAllAuditData(
      userInfo?.organizationId || "",
      { auditor: "" },
      "All",
      0,
      1000
    );

    setCheckAuditNo(data);
  };
  type ReturnType = Yup.StringSchema<string> | "";

  // Annotate the function with the return type

  useEffect(() => {
    setAuditModeType({
      auditMode: formik.values?.auditMode,
      auditType: isSingle ? "single" : "dual",
    });
  }, [formik.values?.auditMode, pathname]);

  useEffect(() => {
    const fetchSpecificAuditData = async () => {
      setIsLoading(true);
      const { audit }: any = await getSpecificAudit(params?.id as string);
      setSpecificUserData(audit as AuditFormData);
      if (audit) {
        formik.setValues({
          creatorId: userInfo?.id || "",
          email: audit.email,
          firstName: audit.firstName || "",
          lastName: audit.lastName || "",
          mobile: audit?.mobile,
          unit: audit.unit || "",
          streetAddress: audit.streetAddress || "",
          city: audit.city || "",
          province: audit.province || "",
          country: audit.country || "",
          postalCode: audit.postalCode || "",
          isMailingAddressSame: audit?.isMailingAddressSame,
          mailingAddress: {
            unit: audit.mailingAddress?.unit || "",
            streetAddress: audit.mailingAddress?.streetAddress || "",
            city: audit.mailingAddress?.city || "",
            province: audit.mailingAddress?.province || "",
            country: audit.mailingAddress?.country || "",
            postalCode: audit.mailingAddress?.postalCode || "",
          },
          notes: {
            note: audit?.notes?.note,
            files: audit?.notes?.files,
          },
          organizationId: audit.organizationId || 0,
          preferredContactMethod: audit?.preferredContactMethod || "",
          auditMode: audit.auditMode || "",
          calculatedSum: audit.calculatedSum || +audit.dCost?.auditCost + +audit.eCost?.auditCost || 0,
          auditType: audit.auditType || "",
          dAuditId: audit?.dAuditId || "",
          dAudit: {
            priority: audit.dAudit?.priority || "3",
            audit: audit.dAudit?.audit || "",
            leadType: audit.dAudit?.leadType || "",
            auditStatus: audit.dAudit?.auditStatus || "",
            auditDate: audit.dAudit?.auditDate || 0,
            startTime: audit.dAudit?.startTime || 0,
            endTime: audit.dAudit?.endTime || 0,
            application: audit.dAudit?.application || "",
            auditorId: audit.dAudit?.auditorId || 0,
            contractorId: audit.dAudit?.contractorId || 0,
            SOId: audit.dAudit?.SOId || 0,
          },
          dCost: {
            auditCost: audit.dCost?.auditCost || "",
            paidBy: audit.dCost?.paidBy || "",
          },
          dPayment: {
            paid: audit.dPayment?.paid || false,
            invoiceSent: audit.dPayment?.invoiceSent || false,
            EABalanceCleared: audit.dPayment?.EABalanceCleared || false,
            contractorBalanceCleared:
              audit.dPayment?.contractorBalanceCleared || false,
            SOBalanceCleared: audit.dPayment?.SOBalanceCleared || false,
            reportSent: audit.dPayment?.reportSent || false,
            paymentType: audit.dPayment?.paymentType || false,
            paymentDate: audit.dPayment?.paymentDate || 0,
          },
          dSONotes: audit?.dSONotes || "",
          eAuditId: audit?.eAuditId || "",
          eAudit: {
            priority: audit.eAudit?.priority || "2",
            audit: audit.eAudit?.audit || 0,
            leadType: audit.eAudit?.leadType || "",
            auditStatus: audit.eAudit?.auditStatus || "",
            auditDate: audit.eAudit?.auditDate || 0,
            startTime: audit.eAudit?.startTime || 0,
            endTime: audit.eAudit?.endTime || 0,
            application: audit.eAudit?.application || "",
            auditorId: audit.eAudit?.auditorId || "",
            contractorId: audit.eAudit?.contractorId || "",
            SOId: audit.eAudit?.SOId || 0,
          },
          eCost: {
            auditCost: audit.eCost?.auditCost || 0,
            paidBy: audit.eCost?.paidBy || "",
          },
          ePayment: {
            paid: audit.ePayment?.paid || false,
            invoiceSent: audit.ePayment?.invoiceSent || false,
            EABalanceCleared: audit.ePayment?.EABalanceCleared || false,
            contractorBalanceCleared:
              audit.ePayment?.contractorBalanceCleared || false,
            SOBalanceCleared: audit.ePayment?.SOBalanceCleared || false,
            reportSent: audit.ePayment?.reportSent || false,
            paymentType: audit.ePayment?.paymentType || false,
            paymentDate: audit.ePayment?.paymentDate || 0,
          },
          eSONotes: audit?.eSONotes || "",
        });
      }

      setIsLoading(false);
    };

    if (editMode) {
      fetchSpecificAuditData();
    }
  }, [params?.id, refecth]);

  useEffect(() => {
    const totalCost =(Number(formik?.values?.dCost?.auditCost) || 0) +(Number(formik?.values?.eCost?.auditCost) || 0);
    formik.setFieldValue("calculatedSum", totalCost);
  }, [formik.values.dCost?.auditCost, formik.values.eCost?.auditCost]);

  useEffect(() => {
    if (
      formik.values.streetAddress &&
      formik.values.city &&
      formik.values.country &&
      formik.values.postalCode
    ) {
      const address = `${formik.values.streetAddress},${formik.values.city},${formik.values.country}, ${formik.values.postalCode}`;
      handleGeocode(address);
    }
  }, [
    formik.values.postalCode,
    formik.values.country,
    formik.values.city,
    formik.values.streetAddress,
  ]);

  useEffect(() => {
    if (
      formik.values.postalCode &&
      formik.values.country &&
      formik.values.city &&
      formik.values.streetAddress &&
      formik.values.email
    ) {
      setIsLastStep(false);
    } else {
      setIsLastStep(true);
    }
  }, [formik]);

  const auditAccordianItem = [
    {
      title: `${formik.values.auditMode} Audits`,
      component: (
        <Daudit
          formik={formik}
          auditMode={formik.values.auditMode}
          specificUserData={specificUserData}
        />
      ),
      action: () => setOpen({ ...open, dAudit: !open.dAudit }),
      actionResult: open.dAudit,
    },
    {
      title: `${formik.values.auditMode} Cost`,
      component: <Dcost formik={formik} auditMode={formik.values.auditMode} />,
      action: () => setOpen({ ...open, dCost: !open.dCost }),
      actionResult: open.dCost,
    },
    {
      title: `${formik.values.auditMode} Payment`,
      component: (
        <Dpayment formik={formik} auditMode={formik.values.auditMode} />
      ),
      action: () => setOpen({ ...open, dPayment: !open.dPayment }),
      actionResult: open.dPayment,
    },
  ];
  const auditAccordianItemEType = [
    {
      title: "E Audits",
      component: (
        <Daudit
          formik={formik}
          auditMode={"E"}
          specificUserData={specificUserData}
        />
      ),
      action: () => setOpen({ ...open, eAudit: !open.eAudit }),
      actionResult: open.eAudit,
    },
    {
      title: "E Cost",
      component: <Dcost formik={formik} auditMode={"E"} />,
      action: () => setOpen({ ...open, eCost: !open.eCost }),
      actionResult: open.eCost,
    },
    {
      title: "E Payment",
      component: <Dpayment formik={formik} auditMode={"E"} />,
      action: () => setOpen({ ...open, ePayment: !open.ePayment }),
      actionResult: open.ePayment,
    },
  ];

  useEffect(() => {
    if (editMode) {
      setActiveStep(1);
    }
  }, [editMode]);

  useEffect(() => {
    if (historyList && historyList[0]?.user && historyList[0].updatedAt) {
      setLastUpdated({
        userName: [
          historyList[0]?.user?.firstName as string,
          historyList[0]?.user?.lastName as string,
        ]
          .filter(Boolean)
          .join(" "),
        updatedAt: historyList[0]?.updatedAt,
        userId: historyList[0]?.user?.id,
      });
    }
  }, [historyList]);

  const handelFormCheck = (e: any) => {
    if (Object.keys(formik.errors)[0]) {
      const keys = Object.keys(formik.errors);
      if (keys.length > 0) {
        const firstKey = keys[0] as keyof typeof formik.errors;
        if (typeof formik.errors[firstKey] === "object") {
          // Code to execute if the value is an object
          document
            ?.getElementById(
              `${firstKey}.${Object.keys(formik.errors[firstKey] as any)[0]}`
            )
            ?.focus();
        } else {
          // Code to execute if the value is not an object
          document?.getElementById(`${Object.keys(formik.errors)[0]}`)?.focus();
        }
      }
    }

    return formik.handleSubmit(e);
  };
  useEffect(() => {
    if (formik?.values?.isMailingAddressSame) {
      formik.setValues({
        ...formik.values,
        mailingAddress: {
          unit: formik.values.unit || "",
          streetAddress: formik.values.streetAddress || "",
          city: formik.values.city || "",
          province: formik.values.province || "",
          country: formik.values.country || "",
          postalCode: formik.values.postalCode || "",
        },
      });
    }
  }, [
    formik?.values?.isMailingAddressSame,
    formik.values.postalCode,
    formik.values.country,
    formik.values.city,
    formik.values.streetAddress,
  ]);

  useEffect(() => {
    !editMode &&
      userInfo?.roles?.[0].name !== "Auditor" &&
      formik.setValues({
        ...formik.values,
        dAudit: {
          ...formik.values.dAudit,
          auditorId: "" as any,
          audit: "",
        } as any,
        eAudit: {
          ...formik.values.eAudit,
          auditorId: "" as any,
          audit: "",
        } as any,
      });
  }, [formik.values.auditMode]);

  const auditActionMenuItems: MenuItemProps[] = [
    {
      icon: <MdOutlineComment className="text-lg" />,
      label: "Comment",
      clickAction: () => setOpenCommentSidebar(true),
    },
    {
      icon: <LiaFileInvoiceSolid className="text-xl" />,
      label: "Invoice",
      clickAction: () => setOpenInvoiceSidebar(true),

      hide: userInfo?.roles?.[0]?.name !== "Admin",
    },
    {
      icon: <HiOutlineDocumentReport className="text-lg" />,
      label: "Report",
      clickAction: () => setOpenReportSidebar(true),
    },
    {
      icon: <LuHistory className="text-lg" />,
      label: "Change History",
      clickAction: () => setOpenHistorySidebar(true),
    },
  ];

  return (
    <>
      <div className="md:p-6 p-4 space-y-6">
        {isAdding || isUpdating || isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start">
                <div className="bg-themePrimary w-12 h-12 flex items-center justify-center rounded-[4px] mr-4 box-around">
                  <FaRegUser className="text-colorWhite text-xl" />
                </div>
                <Heading
                  type="h3"
                  label={`${editMode ? "Edit" : "Create"} Audit`}
                />
              </div>

              {editMode && (
                <div>
                  <MoreMenu
                    actionElement={
                      <>
                        <PiDotsThreeOutlineFill className="text-lg" />
                        <Label className="font-semibold" label="More Action" />
                      </>
                    }
                    actionElementClass="!bg-white border border-themePrimary text-themePrimary py-[10px] px-4 text-base !rounded-[10px] !w-fit max-h-[44px]"
                    items={auditActionMenuItems}
                    placement="bottom-end"
                  />
                </div>
              )}
            </div>
            {editMode && historyList?.length > 0 && (
              <div className="flex lg:items-center items-start bg-[#C8D6FF] text-colorBlack bg-opacity-[0.2] md:px-4 p-1 lg:h-10 h-auto text-[15px] w-full border rounded-normal">
                <ImInfo
                  className="md:text-sm text-xl me-2 md:ms-0 ms-2"
                  color="var(--color-primary)"
                />

                <Label
                  label={`The Audit was last updated by 
                 ${lastUpdated?.userName} on 
                 ${moment(lastUpdated?.updatedAt).format(
                   "dddd, MMMM D, YYYY ,  HH:mm"
                 )}`}
                  size="small"
                  className="text-colorLight"
                />
              </div>
            )}
            <div className="flex justify-center h-6  w-full"></div>

            <Card className="p-6 relative !rounded-tl-none sm:rounded-tr-normal rounded-tr-none">
              <div>
                <div className="absolute top-[-48px] left-[-1px] bg-colorWhite rounded-t-normal md:w-fit w-full flex md:flex-row flex-col gap-2 p-1 pb-0 h-[48px] rounded-normal border border-b-0 rounded-bl-none rounded-br-none">
                  <div
                    onClick={() => setActiveStep(0)}
                    className={` ${activeStep === 0 ? "bg-themePrimary shadow-none" : ""} cursor-pointer font-semibold rounded-normal flex justify-center items-center md:px-10 px-6 py-2 md:py-0`}
                  >
                    <Label
                      label="Client Details"
                      size={isMobile ? "small" : "medium"}
                      className={
                        activeStep === 0
                          ? "text-colorWhite"
                          : "text-themePrimary"
                      }
                    />
                  </div>
                  <div
                    onClick={() => !isLastStep && setActiveStep(1)}
                    className={`${activeStep === 1 ? "bg-themePrimary shadow-none" : ""}  ${isLastStep ? "cursor-not-allowed" : "cursor-pointer"} rounded-normal font-semibold flex justify-center items-center md:px-10 px-6 py-2 md:py-0`}
                  >
                    <Label
                      label="Audit Details"
                      size={isMobile ? "small" : "medium"}
                      className={
                        activeStep === 1
                          ? "text-colorWhite "
                          : "text-themePrimary"
                      }
                    />
                  </div>
                  {editMode &&
                    (userInfo?.roles?.[0].name === "Admin" ||
                      userInfo?.roles?.[0].name === "Auditor") &&
                    (formik?.values?.dCost?.paidBy === "CONTRACTOR" ||
                      formik?.values?.eCost?.paidBy === "CONTRACTOR") && (
                      <div
                        onClick={() => setActiveStep(2)}
                        className={`${activeStep === 2 ? "bg-themePrimary shadow-none" : ""} cursor-pointer rounded-normal font-semibold flex justify-center items-center md:px-10 px-6 py-2 md:py-0`}
                      >
                        <Label
                          label="Payment Note"
                          size={isMobile ? "small" : "medium"}
                          className={
                            activeStep === 2
                              ? "text-colorWhite "
                              : "text-themePrimary"
                          }
                        />
                      </div>
                    )}
                </div>
              </div>

              <form>
                {activeStep === 0 && (
                  <div
                    className={
                      userInfo?.roles?.[0]?.name === "Auditor" && editMode
                        ? "pointer-events-none opacity-70 !cursor-not-allowed"
                        : ""
                    }
                  >
                    <div
                      className={`lg:w-3/5 w-full ${isSingle ? "sm:mt-0 mt-16" : ""}`}
                    >
                      <div
                        className={
                          formik?.values?.dCost?.paidBy === "CONTRACTOR" ||
                          formik?.values?.eCost?.paidBy === "CONTRACTOR"
                            ? "mb-5 md:mt-5 mt-16"
                            : "mb-5 md:mt-5 mt-8"
                        }
                      >
                        <Heading type="h5" label="Client info" />
                      </div>
                      <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                        <SBInput
                          id="firstName"
                          name="firstName"
                          label="First Name"
                          value={formik.values.firstName}
                          onChange={(e) => {
                            formik.setFieldTouched(
                              e?.target?.name || e?.target?.id,
                              true
                            );
                            formik.handleChange(e);
                          }}
                          error={Boolean(formik.errors.firstName)}
                          touched={Boolean(formik.touched.firstName)}
                          errorMessage={formik.errors.firstName}
                        />
                        <SBInput
                          id="lastName"
                          name="lastName"
                          label="Last Name"
                          value={formik.values.lastName}
                          onChange={(e) => {
                            formik.setFieldTouched(
                              e?.target?.name || e?.target?.id,
                              true
                            );
                            formik.handleChange(e);
                          }}
                          error={Boolean(formik.errors.lastName)}
                          touched={Boolean(formik.touched.lastName)}
                          errorMessage={formik.errors.lastName}
                        />
                        <SBInput
                          id="email"
                          name="email"
                          label="Email"
                          requiredField
                          value={formik.values.email}
                          onChange={(e) => {
                            formik.setFieldTouched(
                              e?.target?.name || e?.target?.id,
                              true
                            );
                            formik.handleChange(e);
                          }}
                          error={Boolean(formik.errors.email)}
                          touched={Boolean(formik.touched.email)}
                          errorMessage={formik.errors.email}
                        />
                        <SBInput
                          id="mobile"
                          name="mobile"
                          label="Phone Number"
                          value={formatPhoneNumber(formik.values.mobile)}
                          onChange={(e) => {
                            formik.setFieldTouched(
                              e?.target?.name || e?.target?.id,
                              true
                            );
                            e.target.value = removeSpecialCharacters(
                              e.target.value
                            );
                            formik.handleChange(e);
                          }}
                          error={Boolean(formik.errors.mobile)}
                          touched={Boolean(formik.touched.mobile)}
                          errorMessage={formik.errors.mobile}
                        />

                        <SBSelect
                          id="preferredContactMethod"
                          // name="preferredContactMethod"
                          optionLabel="Preferred Contact Method"
                          label={"Preferred Contact Method"}
                          value={formik.values.preferredContactMethod}
                          options={[
                            { value: "email", label: "Email" },
                            { value: "mobile", label: "Phone Number" },
                          ]}
                          onChange={(data) =>
                            formik.setFieldValue("preferredContactMethod", data)
                          }
                          error={Boolean(formik.errors.preferredContactMethod)}
                          touched={Boolean(
                            formik.touched.preferredContactMethod
                          )}
                          errorMessage={formik.errors.preferredContactMethod}
                        />
                        {/* <SBInput
                          id="preferredContactMethod"
                          name="preferredContactMethod"
                          label={"Preferred Contact Method"}
                          value={formik.values?.preferredContactMethod}
                          onChange={(e) => {
                            formik.setFieldTouched(
                              e?.target?.name || e?.target?.id,
                              true
                            );
                            formik.handleChange(e);
                          }}
                          error={Boolean(formik.errors.preferredContactMethod)}
                          touched={Boolean(
                            formik.touched.preferredContactMethod
                          )}
                          errorMessage={formik.errors.preferredContactMethod}
                        /> */}
                      </div>
                    </div>
                    <hr className="mt-4 mb-5 border-t border-colorLighter" />
                    <div>
                      <div className="mb-5">
                        <Heading type="h5" label="Personal address info" />
                        <br />
                      </div>
                      <AddressInfoDetail
                        formik={formik}
                        type="Personal"
                        isError={false}
                        cordinates={cordinates}
                        loadingMap={ladingMap}
                        handleGeocode={handleGeocode}
                      />
                    </div>
                  </div>
                )}
                {activeStep === 1 && (
                  <>
                    {!isSingle && (
                      <div
                        className={
                          formik?.values?.dCost?.paidBy ===
                            PAID_BY.CONTRACTOR ||
                          formik?.values?.eCost?.paidBy === PAID_BY.CONTRACTOR
                            ? "md:mt-0 mt-16"
                            : "md:mt-0 mt-8"
                        }
                      >
                        <Accordion open={true}>
                          <AccordionHeader
                            className="border-b-colorLighter"
                            onClick={() =>
                              setOpen({ ...open, address: !open.address })
                            }
                          >
                            <Heading type="h5" label="Total Cost (D+E) (CAD)" />
                          </AccordionHeader>
                          <AccordionBody className="!pt-4 py-0">
                            <div className="md:w-[30%] w-full font-normal text-colorBlack mt-2">
                              <SBInput
                                id="calculatedSum"
                                name="calculatedSum"
                                label="Calculated Sum"
                                inputType="number"
                                value={formik.values.calculatedSum}
                                disabled
                                onChange={(e) => {
                                  formik.setFieldTouched(
                                    e?.target?.name || e?.target?.id,
                                    true
                                  );
                                  formik.handleChange(e);
                                }}
                                error={Boolean(formik.errors.calculatedSum)}
                                touched={Boolean(formik.touched.calculatedSum)}
                                errorMessage={formik.errors.calculatedSum}
                              />
                            </div>
                          </AccordionBody>
                        </Accordion>
                      </div>
                    )}
                    <div
                      className={`${isSingle ? "mt-16" : "mt-6"} md:pt-6 sm:mt-0`}
                    >
                      {isSingle && (
                        <div className="flex-1 md:w-[20%]">
                          <div className="lg:-mt-6">
                            <div className="mb-4">
                              <Heading type="h5" label="Audit Mode" />
                            </div>
                            <div
                              className={`border border-colorLighter flex rounded-md ${editMode ? "cursor-not-allowed" : "cursor-pointer"}  `}
                            >
                              <div
                                className={`border-r border-colorLighter flex-1 text-center px-4 py-[10px] text-sm  ${formik.values.auditMode === "D" ? `bg-themePrimary text-colorWhite rounded-l-[5px] ${editMode ? "!bg-blue-gray-200" : ""} ` : ""}`}
                                onClick={() => {
                                  !editMode &&
                                    formik.setFieldValue("auditMode", "D");
                                }}
                              >
                                D
                              </div>
                              <div
                                className={`px-4 py-[10px] flex-1 text-center  text-sm ${formik.values.auditMode === "E" ? `bg-themePrimary text-colorWhite rounded-r-[5px] ${editMode ? "!bg-blue-gray-200" : ""}` : ""}`}
                                onClick={() => {
                                  !editMode &&
                                    formik.setFieldValue("auditMode", "E");
                                }}
                              >
                                E
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col lg:flex-row gap-x-[3rem] ">
                        <div className="flex-1">
                          {auditAccordianItem.map((data, index) => {
                            return (
                              <>
                                <Accordion
                                  key={index}
                                  open={true || data.actionResult}
                                >
                                  <AccordionHeader
                                    className="border-b-colorLighter"
                                    onClick={data.action}
                                  >
                                    <Heading type="h5" label={data.title} />
                                  </AccordionHeader>
                                  <AccordionBody>
                                    <div className=" font-[400] text-black ">
                                      {data.component}
                                    </div>
                                  </AccordionBody>
                                </Accordion>
                              </>
                            );
                          })}

                          <div className="w-full  mt-4">
                            <SBTextarea
                              id={`${formik.values.auditMode.toLocaleLowerCase()}SONotes`}
                              name={`${formik.values.auditMode.toLocaleLowerCase()}SONotes`}
                              value={
                                formik.values.auditMode === "D"
                                  ? formik.values.dSONotes || ""
                                  : formik.values.eSONotes || ""
                              }
                              //  onChange={formik.handleChange}
                              label="Note"
                              // value={formik.values.dSONotes || ""}
                              onChange={(e) => {
                                formik.setFieldTouched(
                                  e?.target?.name || e?.target?.id,
                                  true
                                );
                                formik.handleChange(e);
                              }}
                              error={Boolean(
                                formik.touched.dSONotes &&
                                  formik.errors.dSONotes
                              )}
                              touched={Boolean(formik.touched.dSONotes)}
                              errorMessage={
                                formik.touched.dSONotes &&
                                formik.errors.dSONotes
                                  ? formik.errors.dSONotes
                                  : ""
                              }
                            />
                          </div>
                        </div>

                        {!isSingle && (
                          <div className="flex-1">
                            {auditAccordianItemEType.map((data, index) => {
                              return (
                                <>
                                  <Accordion key={index} open={true}>
                                    <AccordionHeader
                                      className="border-b-colorLighter"
                                      onClick={data.action}
                                    >
                                      <Heading type="h5" label={data.title} />
                                    </AccordionHeader>
                                    <AccordionBody>
                                      <div className=" font-[400] text-colorBlack">
                                        {data.component}
                                      </div>
                                    </AccordionBody>
                                  </Accordion>
                                </>
                              );
                            })}

                            <div className=" w-full mt-4">
                              <SBTextarea
                                id="eSONotes"
                                name="eSONotes"
                                label="Note"
                                value={formik?.values?.eSONotes || ""}
                                onChange={(e) => {
                                  formik.setFieldTouched(
                                    e?.target?.name || e?.target?.id,
                                    true
                                  );
                                  formik.handleChange(e);
                                }}
                                error={Boolean(
                                  formik.touched.eSONotes &&
                                    formik.errors.eSONotes
                                )}
                                touched={Boolean(formik.touched.eSONotes)}
                                errorMessage={
                                  formik.touched.eSONotes &&
                                  formik.errors.eSONotes
                                    ? formik.errors.eSONotes
                                    : ""
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {editMode && activeStep === 2 && <Notes setRefetch={setRefetch} formik={formik} />}

                {activeStep !== 2 && (
                  <>
                    <hr className="mt-4 mb-5 border-t border-colorLighter" />
                    <div className="flex md:flex-nowrap flex-wrap md:flex-row justify-between gap-5">
                      <div className="w-full flex md:flex-row flex-col">
                        {activeStep === 1 && !editMode && (
                          <Button
                            label="Prev"
                            type="button"
                            size="large"
                            onClick={handlePrev}
                            className="hover:bg-hoverPrimary w-full md:w-fit"
                          />
                        )}
                      </div>
                      <div className="w-full flex md:flex-row-reverse flex-col gap-5">
                        {isLoading ? (
                          <LoadingButton size="large" label="Saving" />
                        ) : activeStep === 1 || editMode ? (
                          <Button
                            label="Save"
                            type="button"
                            onClick={handelFormCheck as any}
                            size="large"
                            className="hover:bg-hoverPrimary w-full md:w-fit"
                          />
                        ) : (
                          <Button
                            label="Next"
                            size="large"
                            onClick={handelFormCheck as any}
                            className="hover:bg-hoverPrimary w-full md:w-fit"
                          />
                        )}

                        <Button
                          label="Cancel"
                          size="large"
                          variant="outline-gray"
                          className="hover:bg-colorLightest  w-full md:w-fit"
                          onClick={() => router.push("/audits")}
                        />
                      </div>
                    </div>
                  </>
                )}
              </form>
            </Card>
          </>
        )}
      </div>
      {editMode && (
        <CommentSidebar
          open={openCommentSidebar}
          close={() => {
            setOpenCommentSidebar(false);
          }}
        />
      )}

      <InvoiceSidebar
        open={openInvoiceSidebar}
        close={() => {
          setOpenInvoiceSidebar(false);
        }}
        data={specificUserData}
      />
      {editMode && (
        <ReportSidebar
          open={openReportSidebar}
          close={() => {
            setOpenReportSidebar(false);
          }}
          data={specificUserData}
        />
      )}
      {editMode && (
        <ChangeHistorySidebar
          open={openHistorySidebar}
          close={() => {
            setOpenHistorySidebar(false);
          }}
        />
      )}
    </>
  );
};

export default CreateOrEditAudit;

export function Icon({ open }: IconsProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}
